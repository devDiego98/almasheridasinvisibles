import { User } from 'lucide-react'
import type { Profile } from '../../types/profile'

interface AboutMeProps {
  profile: Profile
}

export function AboutMe({ profile }: AboutMeProps) {
  return (
    <section className="border-t border-slate-200 bg-slate-50 px-4 py-16 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-accent-100 dark:bg-accent-900">
          {profile.photoURL ? (
            <img src={profile.photoURL} alt={profile.displayName} className="h-full w-full object-cover" />
          ) : (
            <User size={32} className="text-accent-400" />
          )}
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Sobre mí</h2>
        <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300">{profile.bio}</p>
      </div>
    </section>
  )
}
