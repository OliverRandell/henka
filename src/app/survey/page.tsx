import ResearchSurvey from '@/components/ResearchSurvey'

export const metadata = { title: 'Consumer research — Henka' }

export default function ConsumerSurveyPage() {
  return <ResearchSurvey
    title="Consumer research"
    introduction="Tell us about a recent shopping decision in Melbourne and what shaped it."
    responderUrl={process.env.HENKA_CONSUMER_FORM_URL}
  />
}
