import Link from 'next/link'

type NavCurrent = 'home' | 'browse' | 'about' | 'other'

type Props = {
  current?: NavCurrent
  /**
   * Render style. 'default' for normal page nav with a bottom border.
   * 'minimal' for cases where the nav sits inside a layout that already
   * has its own top chrome (rare \u2014 default is right for almost everything).
   */
  variant?: 'default' | 'minimal'
}

export default function Nav({ current = 'other', variant = 'default' }: Props) {
  const wrapperClasses =
    variant === 'default'
      ? 'border-b border-stone-100 px-6 py-4 flex items-center justify-between flex-shrink-0'
      : 'px-6 py-4 flex items-center justify-between'

  return (
    <nav className={wrapperClasses}>
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight text-stone-900"
        aria-label="Henka home"
      >
        henka
      </Link>
      <div className="flex items-center gap-6">
        {current !== 'about' && (
          <Link
            href="/about"
            className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            About
          </Link>
        )}
        {current !== 'browse' && (
          <Link
            href="/businesses"
            className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            Browse all
          </Link>
        )}
      </div>
    </nav>
  )
}
