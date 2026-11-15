import ResearchSurvey from '@/components/ResearchSurvey'
import { RESEARCH_FORMS } from '@/lib/research-forms'

export const metadata = { title: 'Consumer research — Henka', description: 'Share your experience finding and choosing businesses and services to inform Henka’s early research.' }

export default function ConsumerSurveyPage() {
  return <ResearchSurvey
    title="Consumer research"
    introduction="Help us understand how people find and choose businesses and services in everyday life. We’re interested in real experiences, including the things that made a choice easier or harder."
    purpose="Henka is an early-stage Australian initiative exploring how everyday choices relate to the environment and animals. We’re listening to people’s experiences to understand recurring problems and decide what deserves further investigation."
    audience="We’d like to hear from people who find and choose shops, services and other businesses. Our research is starting with experiences in Melbourne; read the form’s introduction for any participation guidance before answering."
    participation="The survey asks you to reflect on your experiences and decisions. Follow the link to read and answer the questions in Google Forms. You can review the form before deciding whether to respond."
    buttonLabel="Start consumer survey"
    responderUrl={RESEARCH_FORMS.consumer}
  />
}
