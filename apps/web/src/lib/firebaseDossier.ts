import { db } from './firebaseConfig';
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  increment,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

export interface LeadProfile {
  email: string;
  fullName: string;
  institutionOrCompany: string;
  jobRole: 'Oncologist' | 'Translational_Researcher' | 'Pharma_BD' | 'Investor' | 'Student_Academic' | 'Other' | string;
}

export async function recordDossierDownload(
  lead: LeadProfile,
  paperId: string,
  paperTitle: string,
  format: 'pdf' | 'docx' | 'txt'
) {
  try {
    const sanitizedEmail = lead.email.toLowerCase().trim();
    const leadRef = doc(db, 'leads', sanitizedEmail);
    const telemetryRef = doc(db, 'dossier_telemetry', paperId);
    const eventsRef = collection(db, 'download_events');

    const leadSnap = await getDoc(leadRef);
    const isNewLead = !leadSnap.exists();

    // 1. Upsert Lead Profile with download entry
    if (isNewLead) {
      await setDoc(leadRef, {
        ...lead,
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
        totalDownloads: 1,
        downloadHistory: [{ paperId, format, downloadedAt: new Date().toISOString() }],
      });
    } else {
      const existingHistory = leadSnap.data()?.downloadHistory || [];
      await updateDoc(leadRef, {
        lastActiveAt: serverTimestamp(),
        totalDownloads: increment(1),
        downloadHistory: [
          ...existingHistory,
          { paperId, format, downloadedAt: new Date().toISOString() },
        ],
      });
    }

    // 2. Atomic Aggregation on the White Paper
    const formatFieldMap: Record<'pdf' | 'docx' | 'txt', string> = {
      pdf: 'pdfDownloads',
      docx: 'docxDownloads',
      txt: 'txtDownloads',
    };

    await setDoc(
      telemetryRef,
      {
        paperId,
        title: paperTitle,
        totalRequests: increment(1),
        [formatFieldMap[format]]: increment(1),
        uniqueLeadsCount: increment(isNewLead ? 1 : 0),
        lastRequestedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // 3. Write immutable audit event
    await addDoc(eventsRef, {
      leadEmail: lead.email,
      institution: lead.institutionOrCompany,
      paperId,
      format,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Firebase Telemetry network notice (local persistence active):', error);
  } finally {
    // Store lead identity in localStorage so subsequent clicks skip the modal
    if (typeof window !== 'undefined') {
      localStorage.setItem('cellnoor_lead_profile', JSON.stringify(lead));
    }
  }
}
