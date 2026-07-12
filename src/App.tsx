import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import CustomCursor from '@/components/CustomCursor'
import PublicLayout from '@/layouts/PublicLayout'
import HomePage from '@/pages/HomePage'
import ProjectsPage from '@/pages/ProjectsPage'
import ProjectDetailsPage from '@/pages/ProjectDetailsPage'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminLogin from '@/pages/admin/AdminLogin'
import AdminLayout from '@/layouts/AdminLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProjects from '@/pages/admin/AdminProjects'
import AdminProjectEditor from '@/pages/admin/AdminProjectEditor'
import AdminTestimonials from '@/pages/admin/AdminTestimonials'
import AdminMessages from '@/pages/admin/AdminMessages'
import AdminSettings from '@/pages/admin/AdminSettings'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { Loader as Loader2 } from 'lucide-react'

function LoginGate() {
  const { session, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-purple" /></div>
  if (session) return <Navigate to="/admin" replace />
  return <AdminLogin />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <CustomCursor />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
            </Route>
            <Route path="/admin/login" element={<LoginGate />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="projects/new" element={<AdminProjectEditor />} />
              <Route path="projects/:id" element={<AdminProjectEditor />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
