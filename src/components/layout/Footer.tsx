import { FaInstagram, FaTiktok, FaRedditAlien, FaDiscord } from 'react-icons/fa6'
import type { SocialLinks } from '../../types/profile'

interface FooterProps {
  socialLinks?: SocialLinks
}

const SOCIAL_ICON_LINKS: { key: keyof SocialLinks; label: string; Icon: typeof FaInstagram }[] = [
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram },
  { key: 'tiktok', label: 'TikTok', Icon: FaTiktok },
  { key: 'reddit', label: 'Reddit', Icon: FaRedditAlien },
  { key: 'discord', label: 'Discord', Icon: FaDiscord },
]

export function Footer({ socialLinks = {} }: FooterProps) {
  const activeLinks = SOCIAL_ICON_LINKS.filter(({ key }) => socialLinks[key])

  return (
    <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-center">
        {activeLinks.length > 0 && (
          <div className="flex items-center gap-4">
            {activeLinks.map(({ key, label, Icon }) => (
              <a
                key={key}
                href={socialLinks[key]}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-slate-400 transition-colors hover:text-accent-500 dark:text-slate-500"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        )}
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} Almas Heridas Invisibles. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
