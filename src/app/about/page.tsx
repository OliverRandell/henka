import Link from 'next/link'
import { ResearchArticle } from '@/components/ResearchSite'
import { CRITERIA } from '@/lib/criteria'

export const metadata = { title: 'About — Henka' }

export default function AboutPage() {
  return (
    <ResearchArticle title="About Henka">
      <p>Henka is an early-stage Australian initiative exploring practical ways to reduce harm to the environment, animals and biodiversity. Our research starts with the experiences of shoppers and business operators in Melbourne.</p>
      <h2>The founder</h2>
      <p>Oliver Randell is a Melbourne-based product lead who previously worked in user experience design and front-end development. He started Henka to explore where digital tools could help people and businesses make choices that better reflect their priorities.</p>
      <h2>The directory</h2>
      <p>The <Link href="/businesses">Melbourne directory</Link> helps you find local businesses by category, location and reported practices. An owner-managed label refers to management of the listing. Check the scope and currency of any specific certification or practice with its source.</p>
      <h2>Directory criteria</h2>
      <dl>
        {CRITERIA.map(criterion => (
          <div key={criterion.slug}>
            <dt>{criterion.name}</dt>
            <dd>{criterion.definition}</dd>
          </div>
        ))}
      </dl>
      <p><Link href="/contact">Get in touch about the research or directory</Link>.</p>
    </ResearchArticle>
  )
}
