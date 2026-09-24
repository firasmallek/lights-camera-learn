"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { submitStarForm } from "@/app/actions/submit-star-form";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  age: z.enum(["8", "9", "10", "11", "12", "13", "14", "15", "16", "17"]),
  location: z.literal("Tunis"),
  cfTurnstileResponse: z.string().min(1, "Please complete the CAPTCHA"),
});

type FormData = z.infer<typeof schema>;

export default function StarForm() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    const result = await submitStarForm(data);
    if (result.success) setSuccess(true);
    else setServerError(result.error || "An unknown error occurred.");
  };

  if (success) {
    return (
      <div className="bg-gray-50 p-12 text-center border-t-4 border-black" role="alert">
        <h2 className="font-fjalla text-3xl uppercase tracking-widest mb-4">Form Submitted!</h2>
        <p className="font-libre text-lg text-gray-700">Thank you for your submission. We will be in touch soon.</p>
        <Link href="/" className="inline-block bg-black text-white px-10 py-4 mt-8 font-fjalla uppercase tracking-widest hover:bg-gray-800">Back to Home</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto font-libre" noValidate>
      {serverError && <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4" role="alert">{serverError}</div>}
      <div className="grid md:grid-cols-2 gap-6">
        <div><label htmlFor="star-first-name" className="block font-bold mb-2">First Name *</label><input id="star-first-name" {...register("firstName")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" />{errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>}</div>
        <div><label htmlFor="star-last-name" className="block font-bold mb-2">Last Name *</label><input id="star-last-name" {...register("lastName")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" />{errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>}</div>
      </div>
      <div><label htmlFor="star-email" className="block font-bold mb-2">Email Address *</label><input id="star-email" type="email" {...register("email")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" />{errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}</div>
      <div><label htmlFor="star-phone" className="block font-bold mb-2">Phone Number</label><input id="star-phone" {...register("phone")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" /></div>
      <div><label htmlFor="star-age" className="block font-bold mb-2">Age of Student *</label><select id="star-age" {...register("age")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white"><option value="">Select...</option>{["8", "9", "10", "11", "12", "13", "14", "15", "16", "17"].map((age) => <option key={age} value={age}>{age}</option>)}</select>{errors.age && <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>}</div>
      <div><label htmlFor="star-location" className="block font-bold mb-2">Location *</label><select id="star-location" {...register("location")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white"><option value="">Select...</option><option value="Tunis">Tunis</option></select>{errors.location && <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>}</div>
      <div className="pt-4 flex flex-col items-center"><Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} onSuccess={(token) => setValue("cfTurnstileResponse", token, { shouldValidate: true })} />{errors.cfTurnstileResponse && <p className="text-red-600 text-sm mt-2">{errors.cfTurnstileResponse.message}</p>}<button type="submit" disabled={isSubmitting} className="bg-black text-white px-12 py-4 mt-6 font-fjalla text-xl uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50">{isSubmitting ? "Submitting..." : "Submit"}</button></div>
    </form>
  );
}
