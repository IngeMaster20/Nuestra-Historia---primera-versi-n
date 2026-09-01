import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { ToastProvider } from '@/components/Toast'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/layouts/AppLayout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Book } from '@/pages/Book'
import { MemoryDetail } from '@/pages/MemoryDetail'
import { Photos } from '@/pages/Photos'
import { Notes } from '@/pages/Notes'
import { ImportantDates } from '@/pages/ImportantDates'
import { Settings } from '@/pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/libro" element={<Book />} />
              <Route path="/libro/:id" element={<MemoryDetail />} />
              <Route path="/fotos" element={<Photos />} />
              <Route path="/notitas" element={<Notes />} />
              <Route path="/fechas" element={<ImportantDates />} />
              <Route path="/configuracion" element={<Settings />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
