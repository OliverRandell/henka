import ResearchSurvey from '@/components/ResearchSurvey'

export const metadata = { title: 'Business research — Henka' }

export default function BusinessSurveyPage() {
  return <ResearchSurvey
    title="Business research"
    introduction="Tell us about the day-to-day work of running a business and a recent operational experience."
    responderUrl={process.env.HENKA_BUSINESS_FORM_URL}
  />
}
