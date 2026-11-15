import ResearchSurvey from '@/components/ResearchSurvey'

export const metadata = { title: 'Business research — Henka' }

export default function BusinessSurveyPage() {
  return <ResearchSurvey
    title="Business research"
    introduction="Tell us about a recent experience running your business. We’d like to understand which day-to-day tasks cause problems, what happened when one came up and how you handled it."
    buttonLabel="Start the business survey"
    responderUrl={process.env.HENKA_BUSINESS_FORM_URL}
  />
}
