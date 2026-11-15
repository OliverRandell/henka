import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './ResearchSite.module.css'

export function ResearchSite({ children }: { children: ReactNode }) {
  return (
    <div className={styles.site}>
      <a className={styles.skip} href="#content">Skip to content</a>
      <header className={styles.header}>
        <Link className={styles.wordmark} href="/" aria-label="Henka home">henka.</Link>
        <nav aria-label="Main navigation">
          <Link href="/#research">Research</Link>
          <Link href="/businesses">Directory</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>
      <main id="content">{children}</main>
      <footer className={styles.footer}>
        <span>Henka · Melbourne, Australia</span>
        <nav aria-label="Footer navigation">
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </footer>
    </div>
  )
}

export function ResearchArticle({ title, children }: { title: string; children: ReactNode }) {
  return (
    <ResearchSite>
      <article className={styles.article}>
        <h1>{title}</h1>
        {children}
      </article>
    </ResearchSite>
  )
}
