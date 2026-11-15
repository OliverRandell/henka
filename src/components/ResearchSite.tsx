import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './ResearchSite.module.css'

export function ResearchSite({ children }: { children: ReactNode }) {
  return (
    <div className={styles.site}>
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

export function ResearchArticle({ title, eyebrow, children }: { title: string; eyebrow?: string; children: ReactNode }) {
  return (
    <ResearchSite>
      <article className={styles.article}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1>{title}</h1>
        {children}
      </article>
    </ResearchSite>
  )
}
