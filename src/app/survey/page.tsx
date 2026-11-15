import ResearchSurvey from '@/components/ResearchSurvey'

export const metadata = { title: 'Consumer research — Henka' }

export default function ConsumerSurveyPage() {
  return <ResearchSurvey
    title="Consumer research"
    introduction="Tell us about a recent shopping experience. We’re interested in what you were trying to do, what influenced your decision and anything that got in the way."
    buttonLabel="Start the consumer survey"
    responderUrl={process.env.HENKA_CONSUMER_FORM_URL}
  />
}
