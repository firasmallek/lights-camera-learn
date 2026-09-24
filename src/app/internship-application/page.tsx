import InternshipForm from "@/components/forms/InternshipForm";
import { PageContainer } from "@/components/layout/PageContainer";

export default function InternshipApplicationPage() {
  return (
    <main className="bg-white min-h-screen">
      <PageContainer className="py-16 md:py-20">
        <header className="max-w-4xl mx-auto mb-16 text-center">
          <h1 className="font-fjalla text-4xl md:text-5xl uppercase tracking-widest mb-8">
            Local &amp; International Internship Program Application
          </h1>
          <ol className="font-libre text-left max-w-2xl mx-auto space-y-2 text-gray-700 list-decimal list-inside">
            <li>Fill out this form and submit.</li>
            <li>Next, say hi and send your resume to contact@lightscameralearn.org.</li>
            <li>Check your inbox. We&apos;ll be in touch.</li>
            <li>Follow us on Instagram and Facebook using the links at the bottom of the page.</li>
          </ol>
        </header>
        <InternshipForm />
      </PageContainer>
    </main>
  );
}
