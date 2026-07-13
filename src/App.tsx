import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ReportsPage } from '@/pages/ReportsPage'
import { ReportDetailPage } from '@/pages/ReportDetailPage'
import { CompareMergePage } from '@/pages/CompareMergePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReportsPage />} />
        <Route path="/reports/:id" element={<ReportDetailPage />} />
        <Route path="/reports/:id/compare" element={<CompareMergePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
