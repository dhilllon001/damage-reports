import { create } from 'zustand'
import type { DamageReport, EstimateDocument, EstimateItem } from '@/types'
import { INITIAL_REPORTS } from '@/data/reports'

interface AppState {
  reports: DamageReport[]
  addReport: (report: DamageReport) => void
  updateReport: (id: string, patch: Partial<DamageReport>) => void
  addEstimateItem: (reportId: string, item: EstimateItem) => void
  removeEstimateItem: (reportId: string, itemId: string) => void
  addDocument: (reportId: string, doc: EstimateDocument) => void
  removeDocument: (reportId: string, docId: string) => void
}

export const useStore = create<AppState>((set) => ({
  reports: INITIAL_REPORTS,
  addReport: (report) => set((s) => ({ reports: [report, ...s.reports] })),
  updateReport: (id, patch) =>
    set((s) => ({
      reports: s.reports.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),
  addEstimateItem: (reportId, item) =>
    set((s) => ({
      reports: s.reports.map((r) =>
        r.id === reportId
          ? {
              ...r,
              estimateItems: [...r.estimateItems, item],
              amount: [...r.estimateItems, item].reduce((sum, i) => sum + i.unitCost * i.quantity, 0),
              currency: item.currency,
            }
          : r
      ),
    })),
  removeEstimateItem: (reportId, itemId) =>
    set((s) => ({
      reports: s.reports.map((r) => {
        if (r.id !== reportId) return r
        const estimateItems = r.estimateItems.filter((i) => i.id !== itemId)
        return {
          ...r,
          estimateItems,
          amount: estimateItems.reduce((sum, i) => sum + i.unitCost * i.quantity, 0) || undefined,
        }
      }),
    })),
  addDocument: (reportId, doc) =>
    set((s) => ({
      reports: s.reports.map((r) =>
        r.id === reportId ? { ...r, documents: [...r.documents, doc] } : r
      ),
    })),
  removeDocument: (reportId, docId) =>
    set((s) => ({
      reports: s.reports.map((r) =>
        r.id === reportId
          ? { ...r, documents: r.documents.filter((d) => d.id !== docId) }
          : r
      ),
    })),
}))
