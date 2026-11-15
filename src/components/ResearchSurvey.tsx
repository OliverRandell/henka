import Link from 'next/link'
import { ResearchArticle } from './ResearchSite'
import styles from './ResearchSite.module.css'

export default function ResearchSurvey({ title, introduction, purpose, audience, participation, buttonLabel, responderUrl, availabilityNote }: {
  title: string
  introduction: string
  purpose: string
  audience: string
  participation: string
  buttonLabel: string
  responderUrl: string
  availabilityNote?: string
}) {
  return (
    <ResearchArticle title={title} eyebrow="Henka research">
      <p>{introduction}</p>
      {availabilityNote && <aside className={styles.surveyNotice} aria-label="Survey availability"><p>{availabilityNote}</p></aside>}
      <div className={styles.surveyActions}>
        <a className={styles.button} href={responderUrl} target="_blank" rel="noopener noreferrer" aria-describedby="survey-external-note">{buttonLabel}</a>
        <small id="survey-external-note">You’ll leave Henka to complete the survey in Google Forms. Opens in a new tab.</small>
      </div>
      <h2>Why we’re asking</h2>
      <p>{purpose}</p>
      <h2>Who we’d like to hear from</h2>
      <p>{audience}</p>
      <h2>What taking part involves</h2>
      <p>{participation}</p>
      <h2>Your participation and privacy</h2>
      <p>Taking part is voluntary. Review the form before deciding what to share. Contact details, business details and free-text answers may identify you. Please avoid including sensitive information or identifying details about other people.</p>
      <p>Google Forms collects responses. Read Henka’s <Link href="/privacy">research privacy notice</Link> for how responses are used and how to ask about access, deletion or withdrawal.</p>
      <p>Questions before you take part? <Link href="/contact">Contact Henka</Link>.</p>
    </ResearchArticle>
  )
}
