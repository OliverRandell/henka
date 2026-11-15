'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import styles from './ResearchSite.module.css'

export default function SiteHeader() {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const updateHeight = () => document.documentElement.style.setProperty('--site-header-height', `${header.getBoundingClientRect().height}px`)
    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)
    return () => { observer.disconnect(); document.documentElement.style.removeProperty('--site-header-height') }
  }, [])
  return <>
    <a className={styles.skip} href="#content">Skip to content</a>
    <header ref={headerRef} className={styles.header}>
      <Link className={styles.wordmark} href="/" aria-label="Henka home" aria-current={pathname === '/' ? 'page' : undefined}>henka.</Link>
      <nav aria-label="Main navigation">
        {[['/businesses', 'Directory'], ['/about', 'About']].map(([href, label]) => (
          <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(href + '/') ? 'page' : undefined}>{label}</Link>
        ))}
      </nav>
    </header>
  </>
}
