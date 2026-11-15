import ResearchSurvey from '@/components/ResearchSurvey'
import { RESEARCH_FORMS } from '@/lib/research-forms'

export const metadata = { title: 'Business research — Henka', description: 'Share recent purchasing and operational experiences to inform Henka’s early business research.' }

export default function BusinessSurveyPage() {
  return <ResearchSurvey
    title="Business research"
    introduction="Share what everyday purchasing and operations look like in your business. We’re investigating the practical challenges people encounter and how they handle them."
    purpose="Henka is at an early research stage. Recent operational experiences can help us understand the context, constraints and workarounds behind recurring business challenges, and decide what to investigate further."
    audience="We’d like to hear from people involved in running a business or making its day-to-day purchasing and operational decisions. Read the form’s introduction for participation guidance before answering."
    participation="Reflect on recent experiences in your business, then follow the link to read and answer the questions in Google Forms. Concrete experiences help us understand what happened in practice. You can review the form before deciding whether to respond."
    buttonLabel="Start business survey"
    responderUrl={RESEARCH_FORMS.business}
    availabilityNote="At our latest check, Google Forms reported that this survey was closed to responses. Open the form to check its current availability, or contact Henka with questions."
  />
}
