import Link from 'next/link'
import { ResearchArticle } from './ResearchSite'
import styles from './ResearchSite.module.css'

function getResponderUrl(value: string | undefined) {
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.origin !== 'https://docs.google.com' || !/^\/forms\/(?:u\/\d+\/)?d\/(?:e\/)?[\w-]+\/viewform\/?$/.test(url.pathname)) return null
    return new URL(url.pathname, url.origin)
  } catch {
    return null
  }
}

export default function ResearchSurvey({ title, introduction, buttonLabel, responderUrl }: {
  title: string
  introduction: string
  buttonLabel: string
  responderUrl?: string
}) {
  const responder = getResponderUrl(responderUrl)

  return (
    <ResearchArticle title={title}>
      <p>{introduction}</p>
      {responder ? (
        <>
          <a className={styles.button} href={responder.href}>{buttonLabel}</a>
          <p>The survey opens in Google Forms.</p>
        </>
      ) : (
        <p>The survey is currently unavailable. <Link href="/contact">Contact Henka</Link> for research enquiries.</p>
      )}
      <p>Taking part is voluntary. Google Forms processes responses. If you choose to provide an email for follow-up, it can identify your response. Read how we handle responses in the <Link href="/privacy">privacy notice</Link>.</p>
    </ResearchArticle>
  )
}
