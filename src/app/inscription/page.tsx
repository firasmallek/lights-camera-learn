import { PageContainer } from "@/components/layout/PageContainer";
import StarForm from "@/components/forms/StarForm";

export default function InscriptionPage() {
  return (
    <main className="bg-white min-h-screen">
      <PageContainer className="py-16 md:py-20">
        <header className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="font-fjalla text-4xl md:text-5xl uppercase tracking-widest mb-6">Every Child Is a Star!</h1>
          <h2 className="font-fjalla text-2xl uppercase tracking-widest mb-6">Inscription | تسجيل | Enroll</h2>
          <p className="font-libre text-lg text-gray-700">Join us for our edutainment camps in Tunis.</p>
        </header>
        <StarForm />
      </PageContainer>
    </main>
  );
}
