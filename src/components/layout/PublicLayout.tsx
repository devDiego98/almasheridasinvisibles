import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { getProfile } from '../../firebase/profile.service'
import { DEFAULT_PROFILE, type Profile } from '../../types/profile'

export interface PublicLayoutContext {
  profile: Profile
}

export function PublicLayout() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)

  useEffect(() => {
    getProfile().then(setProfile)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar siteName={profile.displayName !== DEFAULT_PROFILE.displayName ? profile.displayName : undefined} />
      <main className="flex-1">
        <Outlet context={{ profile } satisfies PublicLayoutContext} />
      </main>
      <Footer socialLinks={profile.socialLinks} />
    </div>
  )
}
