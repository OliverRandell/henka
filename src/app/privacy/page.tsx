import Link from 'next/link'
import { ResearchArticle } from '@/components/ResearchSite'

export const metadata = { title: 'Research privacy — Henka' }

export default function PrivacyPage() {
  return (
    <ResearchArticle title="Research privacy">
      <h2>What we collect</h2>
      <p>Participation is voluntary. Our surveys ask about shopping or business experiences. Providing an email for research follow-up is optional. Your email, business details or details in a free-text answer may identify you. Please avoid including names or identifying details about other people.</p>
      <h2>How responses are handled</h2>
      <p>Google Forms collects responses and Google Sheets stores them for analysis. Henka uses responses to understand recurring problems and decide what to investigate further. Henka may share summaries of the findings with identifying details removed.</p>
      <h2>Questions and withdrawal</h2>
      <p><Link href="/contact">Contact Henka</Link> with questions about access, retention or deletion, or to request withdrawal. Describe when you responded and which survey you used. If we cannot identify your response, we may be unable to remove it.</p>
    </ResearchArticle>
  )
}
