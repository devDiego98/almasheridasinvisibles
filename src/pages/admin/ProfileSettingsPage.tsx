import { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { getProfile, saveProfile } from '../../firebase/profile.service'
import { uploadProfilePhoto } from '../../services/cloudinary.service'
import { DEFAULT_PROFILE, type Profile } from '../../types/profile'

export function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .finally(() => setLoading(false))
  }, [])

  async function handlePhotoChange(file: File) {
    setUploadingPhoto(true)
    try {
      const url = await uploadProfilePhoto(file)
      setProfile((p) => ({ ...p, photoURL: url }))
    } finally {
      setUploadingPhoto(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveProfile(profile)
      setSavedMessage(true)
      setTimeout(() => setSavedMessage(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-slate-400">Cargando…</p>

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-slate-900 dark:text-white">Mi perfil</h1>

      <Card className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <label className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-accent-100 dark:bg-accent-900">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handlePhotoChange(e.target.files[0])}
            />
            {profile.photoURL ? (
              <img src={profile.photoURL} alt="" className="h-full w-full object-cover" />
            ) : (
              <User size={28} className="text-accent-400" />
            )}
          </label>
          <p className="text-xs text-slate-400">{uploadingPhoto ? 'Subiendo…' : 'Click en la foto para cambiarla'}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Nombre</label>
          <input
            value={profile.displayName}
            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Sobre mí</label>
          <textarea
            value={profile.bio}
            rows={4}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Título del hero</label>
            <input
              value={profile.heroTitle}
              onChange={(e) => setProfile({ ...profile, heroTitle: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Subtítulo del hero</label>
            <input
              value={profile.heroSubtitle}
              onChange={(e) => setProfile({ ...profile, heroSubtitle: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Redes sociales</label>
          <div className="grid gap-3 sm:grid-cols-2">
            {(['instagram', 'tiktok', 'reddit', 'discord'] as const).map((key) => (
              <input
                key={key}
                value={profile.socialLinks[key] ?? ''}
                placeholder={`Link de ${key}`}
                onChange={(e) =>
                  setProfile({ ...profile, socialLinks: { ...profile.socialLinks, [key]: e.target.value } })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
              />
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={profile.defaultCommentsEnabled}
            onChange={(e) => setProfile({ ...profile, defaultCommentsEnabled: e.target.checked })}
            className="h-4 w-4 rounded accent-accent-500"
          />
          Permitir comentarios por defecto en historias nuevas
        </label>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            Guardar cambios
          </Button>
          {savedMessage && <span className="text-sm text-emerald-600 dark:text-emerald-400">Guardado ✓</span>}
        </div>
      </Card>
    </div>
  )
}
