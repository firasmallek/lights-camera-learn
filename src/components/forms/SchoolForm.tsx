"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { submitSchoolForm } from "@/app/actions/submit-school-form";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Invalid email address"),
  school: z.string().min(1, "School or center is required"),
  country: z.string().min(1, "Country is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  details: z.string().min(1, "Please provide more details"),
  cfTurnstileResponse: z.string().min(1, "Please complete the CAPTCHA"),
});

type FormData = z.infer<typeof schema>;

export default function SchoolForm() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    const result = await submitSchoolForm(data);
    if (result.success) setSuccess(true);
    else setServerError(result.error || "An unknown error occurred.");
  };

  if (success) {
    return (
      <div className="bg-gray-50 p-12 text-center border-t-4 border-black" role="alert">
        <h2 className="font-fjalla text-3xl uppercase tracking-widest mb-4">Form Submitted!</h2>
        <p className="font-libre text-lg text-gray-700">Thank you for contacting us. We will be in touch soon.</p>
        <Link href="/" className="inline-block bg-black text-white px-10 py-4 mt-8 font-fjalla uppercase tracking-widest hover:bg-gray-800">Back to Home</Link>
      </div>
    );
  }

  const field = (name: keyof FormData, label: string, type = "text", required = true) => (
    <div><label htmlFor={`school-${name}`} className="block font-bold mb-2">{label}{required ? " *" : ""}</label><input id={`school-${name}`} type={type} {...register(name)} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" />{errors[name] && <p className="text-red-600 text-sm mt-1">{String(errors[name]?.message)}</p>}</div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto font-libre" noValidate>
      {serverError && <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4" role="alert">{serverError}</div>}
      <div className="grid md:grid-cols-2 gap-6">{field("firstName", "First Name")}{field("lastName", "Last Name")}</div>
      <div className="grid md:grid-cols-2 gap-6">{field("title", "Title")}{field("email", "Email Address", "email")}</div>
      {field("school", "Name of School/Center")}
      {field("country", "Country")}
      <div className="grid md:grid-cols-2 gap-6">{field("addressLine1", "Address Line 1")}{field("addressLine2", "Address Line 2", "text", false)}</div>
      <div className="grid md:grid-cols-3 gap-6">{field("city", "City")}{field("state", "State")}{field("zip", "ZIP Code")}</div>
      <div><label htmlFor="school-details" className="block font-bold mb-2">What is the age range of your students? What is their level of English? How did you hear about us? *</label><textarea id="school-details" rows={6} {...register("details")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" />{errors.details && <p className="text-red-600 text-sm mt-1">{errors.details.message}</p>}</div>
      <div className="pt-4 flex flex-col items-center"><Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} onSuccess={(token) => setValue("cfTurnstileResponse", token, { shouldValidate: true })} />{errors.cfTurnstileResponse && <p className="text-red-600 text-sm mt-2">{errors.cfTurnstileResponse.message}</p>}<button type="submit" disabled={isSubmitting} className="bg-black text-white px-12 py-4 mt-6 font-fjalla text-xl uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50">{isSubmitting ? "Submitting..." : "Submit"}</button></div>
    </form>
  );
}
