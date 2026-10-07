# apps/api/routers/export.py
from fastapi import APIRouter, Query, HTTPException, Response
from typing import Optional
from datetime import datetime
from apps.api.constants.dossiers import get_dossier_data
from packages.evidence_graph.pdf_generator import DynamicPDFDossierGenerator

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
        # Generate DOCX HTML stream
        benchmarks_html = "".join([
            f"<tr><td>{b['name']}</td><td><b>{b['cellNoorScore']}</b></td><td>{b['standardBaseline']}</td><td><font color='#10B981'><b>{b['netSuperiority']}</b></font></td></tr>"
            for b in data['benchmarks']
        ])
        supporting_html = "".join([f"<li>{s}</li>" for s in data['supporting_evidence']])
        contradicting_html = "".join([f"<li>{c}</li>" for c in data['contradicting_evidence']])

        html_content = f"""
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>{data['title']}</title>
          <style>
            body {{ font-family: Arial, sans-serif; color: #0F172A; line-height: 1.5; padding: 20px; }}
            h1 {{ color: #0E7490; font-size: 18pt; margin-bottom: 5px; }}
            h2 {{ color: #0F172A; font-size: 13pt; border-bottom: 2px solid #0E7490; padding-bottom: 4px; margin-top: 20px; }}
            .meta {{ color: #64748B; font-size: 9pt; margin-bottom: 15px; }}
            .motto {{ color: #10B981; font-style: italic; font-weight: bold; margin-bottom: 20px; }}
            .summary-box {{ background: #F8FAFC; border: 1px solid #CBD5E1; padding: 12px; margin-bottom: 15px; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 10px; }}
            th, td {{ border: 1px solid #CBD5E1; padding: 8px; text-align: left; font-size: 9pt; }}
            th {{ background: #F1F5F9; }}
          </style>
        </head>
        <body>
          <div style="margin-bottom: 15px;">
            <img src="https://stemcells.noorgenx.com/brand/noorgenx_trademark_clean.png" alt="NoorGenX™ Logo" style="height: 48px; width: auto;" />
          </div>
          <h1>{data['title']}</h1>
          <div class="meta">
            <strong>Category:</strong> {data['category']} | <strong>Published:</strong> October 2026<br/>
            <strong>Operating Entity:</strong> Horizon Commerce LLC (Lorton, VA; UEI: NY9AHGK2BBZ7)<br/>
            <strong>Ecosystem:</strong> NoorGenX Platform Suite (amjad@noorgenx.com)
          </div>
          <div class="motto">"No cancer left behind. Every patient has a cure."</div>

          <div class="summary-box">
            <strong>Target Indication:</strong> {data['indication']}<br/>
            <strong>Addressable Market:</strong> {data['market']}<br/>
            <strong>Key Value Metric / ROI:</strong> {data['roi']}<br/><br/>
            <strong>Target Claim:</strong> {data['target_claim']}
          </div>

          <h2>1. Scientific Benchmarks & Target Hypothesis</h2>
          <p><strong>Confidence:</strong> {data['confidence']}</p>
          <table>
            <thead>
              <tr>
                <th>Benchmark Metric</th>
                <th>CellNoor Score</th>
                <th>Standard Baseline</th>
                <th>Net Superiority</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks_html}
            </tbody>
          </table>

          <h2>2. Regulatory Audit & Safety Gate</h2>
          <p>
            <strong>Sample Accession ID:</strong> {data['sample_id']}<br/>
            <strong>FDA CBER Teratoma Hazard:</strong> {data['teratoma_hazard']}<br/>
            <strong>Selectivity Status:</strong> {data['selectivity']}
          </p>

          <h2>3. Multi-Omics Evidence Graph</h2>
          <p><strong>Supporting Evidence:</strong></p>
          <ul>{supporting_html}</ul>
          <p><strong>Contradicting Evidence:</strong></p>
          <ul>{contradicting_html}</ul>
          <p><strong>Weakest Link:</strong> {data['weakest_link']}</p>
          <hr/>
          <p class="meta">Horizon Commerce LLC | License Clearance Verified | NoorGenX Platform Suite</p>
        </body>
        </html>
        """
        return Response(
            content=html_content,
            media_type="application/vnd.ms-word",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
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
