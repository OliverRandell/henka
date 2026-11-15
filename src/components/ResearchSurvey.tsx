import Link from 'next/link'
import { ResearchArticle } from './ResearchSite'

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

export default function ResearchSurvey({ title, introduction, responderUrl }: {
  title: string
  introduction: string
  responderUrl?: string
}) {
  const responder = getResponderUrl(responderUrl)
  const embed = responder && new URL(responder)
  embed?.searchParams.set('embedded', 'true')

  return (
    <ResearchArticle title={title}>
      <p>{introduction}</p>
      <p>Taking part is voluntary. Google Forms processes responses. If you choose to provide an email for follow-up, it can identify your response. Read how we handle responses in the <Link href="/privacy">privacy notice</Link>.</p>
      {responder && embed ? (
        <>
          <p><a href={responder.href}>Open the survey directly in Google Forms</a></p>
          <iframe title={title} src={embed.href} loading="lazy" />
        </>
      ) : (
        <p>The survey is currently unavailable. <Link href="/contact">Contact Henka</Link> for research enquiries.</p>
      )}
    </ResearchArticle>
  )
}
