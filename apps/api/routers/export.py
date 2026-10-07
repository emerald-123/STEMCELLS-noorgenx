# apps/api/routers/export.py
from fastapi import APIRouter, Query, HTTPException, Response
from typing import Optional
from datetime import datetime
from apps.api.constants.dossiers import get_dossier_data
from packages.evidence_graph.pdf_generator import DynamicPDFDossierGenerator
from apps.api.services.docx_generator import generate_lineage_docx

router = APIRouter(prefix="/api/v1/dossier", tags=["Export"])
pdf_generator = DynamicPDFDossierGenerator()

@router.get("/export")
@router.post("/export")
async def export_dossier(
    paper_id: str = Query("bone_marrow_aml", description="Lineage ID, e.g., hematology, ophthalmic, cardiac, neuro, endocrine, corneal_limbal"),
    format: str = Query("pdf", regex="^(pdf|docx|txt)$")
):
    normalized_id = paper_id.lower().strip()
    data = get_dossier_data(normalized_id)
    
    if not data:
        raise HTTPException(status_code=404, detail=f"Lineage dossier '{paper_id}' not found.")

    filename = f"CellNoor_Executive_Dossier_{normalized_id.upper()}.{format}"

    if format == "pdf":
        pdf_bytes = pdf_generator.generate_pdf_bytes(paper_id=normalized_id)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    elif format == "docx":
        docx_buffer = generate_lineage_docx(data, normalized_id)
        filename = f"CellNoor_Executive_Dossier_{normalized_id.upper()}.docx"
        return Response(
            content=docx_buffer.getvalue(),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    elif format == "txt":
        benchmarks_txt = "\n".join([
            f"- {b['name']}: {b['cellNoorScore']} | Baseline: {b['standardBaseline']} | Superiority: {b['netSuperiority']}"
            for b in data['benchmarks']
        ])
        supporting_txt = "\n".join([f"- {s}" for s in data['supporting_evidence']])
        contradicting_txt = "\n".join([f"- {c}" for c in data['contradicting_evidence']])

        txt_content = f"""
================================================================================
[ NOORGENX™ PLATFORM SUITE - {data['category'].upper()} DOSSIER ]
Horizon Commerce LLC (Lorton, VA; UEI: NY9AHGK2BBZ7) | amjad@noorgenx.com
================================================================================

TITLE: {data['title']}
INDICATION: {data['indication']}
MARKET: {data['market']}
ESTIMATED ROI: {data['roi']}
TARGET CLAIM: {data['target_claim']}
CONFIDENCE: {data['confidence']}

SAMPLE ACCESSION ID: {data['sample_id']}
FDA TERATOMA HAZARD: {data['teratoma_hazard']}
SELECTIVITY: {data['selectivity']}

BENCHMARKS:
{benchmarks_txt}

SUPPORTING EVIDENCE:
{supporting_txt}

CONTRADICTING EVIDENCE:
{contradicting_txt}

WEAKEST LINK: {data['weakest_link']}

================================================================================
Generated via CellNoor Platform Suite | Horizon Commerce LLC (amjad@noorgenx.com)
================================================================================
        """.strip()
        return Response(
            content=txt_content,
            media_type="text/plain",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
