import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Hero } from '../../components/home/Hero'
import { StoryGrid } from '../../components/home/StoryGrid'
import { AboutMe } from '../../components/home/AboutMe'
import { listPublishedStories } from '../../firebase/stories.service'
import type { PublicLayoutContext } from '../../components/layout/PublicLayout'
import type { Story } from '../../types/story'

export function HomePage() {
  const { profile } = useOutletContext<PublicLayoutContext>()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPublishedStories()
      .then(setStories)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Hero title={profile.heroTitle} subtitle={profile.heroSubtitle} />
      <StoryGrid stories={stories} loading={loading} />
      <AboutMe profile={profile} />
    </>
  )
}
