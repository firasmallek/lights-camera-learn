import { PageContainer } from "@/components/layout/PageContainer";
import SchoolForm from "@/components/forms/SchoolForm";

export default function SchoolsPage() {
  return (
    <main className="bg-white min-h-screen">
      <PageContainer className="py-16 md:py-20">
        <header className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="font-fjalla text-4xl md:text-5xl uppercase tracking-widest mb-6">Contact Us</h1>
          <p className="font-libre text-lg text-gray-700">Would your school benefit from one of our programs? We would love to hear from you.</p>
          <p className="font-libre text-lg text-gray-700 mt-4">Please complete the form below.</p>
        </header>
        <SchoolForm />
      </PageContainer>
    </main>
  );
}
