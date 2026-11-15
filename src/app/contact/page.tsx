import { ResearchArticle } from '@/components/ResearchSite'

export const metadata = { title: 'Contact — Henka' }

export default function ContactPage() {
  return (
    <ResearchArticle title="Contact Henka">
      <p>For research questions, directory corrections or general enquiries, email <a href="mailto:hello@henka.com.au">hello@henka.com.au</a>.</p>
      <p>If you’re reporting a directory correction, include the listing link and a source we can check.</p>
    </ResearchArticle>
  )
}
