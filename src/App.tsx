import { Routes, Route } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { RequireAdmin } from './routes/RequireAdmin'

import { HomePage } from './pages/public/HomePage'
import { StoryDetailPage } from './pages/public/StoryDetailPage'
import { ChapterReaderPage } from './pages/public/ChapterReaderPage'
import { AccountPage } from './pages/public/AccountPage'

import { LoginPage } from './pages/admin/LoginPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { StoryFormPage } from './pages/admin/StoryFormPage'
import { ChapterListPage } from './pages/admin/ChapterListPage'
import { ChapterEditorPage } from './pages/admin/ChapterEditorPage'
import { ProfileSettingsPage } from './pages/admin/ProfileSettingsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/historia/:storySlug" element={<StoryDetailPage />} />
        <Route path="/historia/:storySlug/capitulo/:chapterOrder" element={<ChapterReaderPage />} />
        <Route path="/mi-cuenta" element={<AccountPage />} />
      </Route>

      <Route path="/admin/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="historias/nueva" element={<StoryFormPage />} />
        <Route path="historias/:storyId/editar" element={<StoryFormPage />} />
        <Route path="historias/:storyId/capitulos" element={<ChapterListPage />} />
        <Route path="historias/:storyId/capitulos/:chapterId/editar" element={<ChapterEditorPage />} />
        <Route path="perfil" element={<ProfileSettingsPage />} />
      </Route>
    </Routes>
  )
}
