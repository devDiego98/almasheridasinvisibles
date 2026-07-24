interface HeroProps {
  title: string
  subtitle: string
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-accent-50 to-transparent px-4 py-20 text-center dark:border-slate-800 dark:from-accent-950">
      <h1 className="mx-auto max-w-2xl font-serif text-4xl font-bold text-slate-900 sm:text-5xl dark:text-white">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">{subtitle}</p>
      <a
        href="#historias"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-600"
      >
        Ver historias
      </a>
    </section>
  )
}
