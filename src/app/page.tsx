import Image from 'next/image'
import Link from 'next/link'
import { ResearchSite } from '@/components/ResearchSite'
import styles from '@/components/ResearchSite.module.css'

export const metadata = {
  title: 'Henka — Research for better everyday choices',
  description: 'An early-stage Australian initiative exploring how everyday choices and business practices can reduce harm to the environment and animals.',
}

export default function HomePage() {
  return (
    <ResearchSite>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>An independent Australian initiative</p>
          <h1>Better choices should be easier to make.</h1>
          <p>Henka is exploring how everyday choices and business practices can reduce harm to the environment and animals. We’re starting in Melbourne, by listening to people who shop here and the businesses that serve them.</p>
          <div className={styles.actions}>
            <Link className={styles.button} href="#research">Take part in the research</Link>
            <Link className={styles.textLink} href="/businesses">Browse the directory</Link>
          </div>
        </div>
        <Image src="/hero-photo.jpg" alt="" width={4928} height={3280} sizes="(max-width: 760px) 95vw, 43vw" preload />
      </section>

      <section className={styles.section} id="research">
        <h2>Tell us what happens in practice.</h2>
        <p>We’re interested in recent experiences: what you did, what got in the way and what worked. Your answers will help us decide which problems are worth investigating further.</p>
        <div className={styles.researchLinks}>
          <Link href="/survey">Share your experience as a shopper <span aria-hidden="true">↗</span></Link>
          <Link href="/business">Share your experience running a business <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Who’s behind Henka?</h2>
        <p>I’m Oliver Randell, a Melbourne-based product lead with a background in design and development. I started Henka to understand where better tools could make a practical difference for people and businesses.</p>
        <p><Link className={styles.textLink} href="/about">Read about Henka and our approach</Link></p>
      </section>

      <section className={styles.directory}>
        <h2>Explore local businesses.</h2>
        <p>Use the Melbourne directory and map to find shops, cafés and services by suburb, category or practice.</p>
        <Link className={styles.textLink} href="/businesses">Explore the Melbourne directory →</Link>
      </section>
    </ResearchSite>
  )
}
