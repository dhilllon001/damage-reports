import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ReportsPage } from '@/pages/ReportsPage'
import { ReportDetailPage } from '@/pages/ReportDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReportsPage />} />
        <Route path="/reports/:id" element={<ReportDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
