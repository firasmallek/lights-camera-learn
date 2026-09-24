"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { submitApplication } from "@/app/actions/submit-application";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  pronouns: z.enum(["she/her", "he/him", "they/them", "other"]),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  birthday: z.string().min(1, "Birthday is required"),
  nationality: z.string().min(1, "Nationality is required"),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  languages: z.string().min(1, "Languages are required"),
  film_project: z.enum(["Yes", "Not yet - this will be my first experience", "It&apos;s complicated"]).optional(),
  favorite_movie: z.string().min(1, "Favorite movie is required"),
  traveled: z.string().min(1, "Travel history is required"),
  why_youth: z.string().min(1, "Why you want to work with youth is required"),
  passions: z.string().optional(),
  passionate_filmmaking: z.string().min(1, "This field is required"),
  bring_to_team: z.string().min(1, "This field is required"),
  positions: z.array(z.string()).min(1, "Please select at least one position"),
  program: z.array(z.string()).min(1, "Please select at least one program"),
  disabilities: z.enum(["Yes", "No"]).optional(),
  costs_agreement: z.boolean().refine(val => val === true, "You must agree to the costs"),
  physical_agreement: z.boolean().refine(val => val === true, "You must agree to the physical requirements"),
  legal_agreement: z.boolean().refine(val => val === true, "You must agree to the legal requirements"),
  how_did_you_hear: z.enum(["Friend/Family", "Referral", "Facebook", "Instagram", "University", "Other"]),
  cfTurnstileResponse: z.string().min(1, "Please complete the CAPTCHA")
});

type FormData = z.infer<typeof schema>;

export default function InternshipForm() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { positions: [], program: [] }
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    const res = await submitApplication(data);
    if (res.success) {
      setSuccess(true);
    } else {
      setServerError(res.error || "An unknown error occurred.");
    }
  };

  if (success) {
    return (
      <div className="bg-gray-50 p-12 text-center border-t-4 border-black" role="alert" aria-live="polite">
        <h2 className="font-fjalla text-3xl uppercase tracking-widest mb-4">Application Received!</h2>
        <p className="font-libre text-lg text-gray-700">Next, say hi and send your resume to us at contact@lightscameralearn.org.</p>
        <p className="font-libre text-lg text-gray-700 mt-4">Check your inbox! We&apos;ll be in touch.</p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-10 py-4 mt-8 font-fjalla text-lg uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 max-w-4xl mx-auto font-libre" noValidate>
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md" role="alert" aria-live="assertive">
          {serverError}
        </div>
      )}

      {/* 1. Personal Information */}
      <section className="space-y-6">
        <h2 className="font-fjalla text-2xl uppercase tracking-widest border-b border-gray-200 pb-2">Personal Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block font-bold mb-2">What&apos;s your name? *</label>
            <input id="name" type="text" {...register("name")} aria-invalid={!!errors.name} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black" />
            {errors.name && <p className="text-red-600 text-sm mt-1" role="alert">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="pronouns" className="block font-bold mb-2">What are your preferred pronouns *</label>
            <select id="pronouns" {...register("pronouns")} aria-invalid={!!errors.pronouns} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black">
              <option value="">Select...</option>
              <option value="she/her">she/her</option>
              <option value="he/him">he/him</option>
              <option value="they/them">they/them</option>
              <option value="other">other</option>
            </select>
            {errors.pronouns && <p className="text-red-600 text-sm mt-1" role="alert">{errors.pronouns.message}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block font-bold mb-2">What&apos;s your email address? *</label>
            <input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" />
            {errors.email && <p className="text-red-600 text-sm mt-1" role="alert">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block font-bold mb-2">What&apos;s your phone number *</label>
            <input id="phone" type="text" {...register("phone")} aria-invalid={!!errors.phone} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" />
            {errors.phone && <p className="text-red-600 text-sm mt-1" role="alert">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="birthday" className="block font-bold mb-2">When is your birthday? *</label>
            <input id="birthday" type="date" {...register("birthday")} aria-invalid={!!errors.birthday} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" />
            {errors.birthday && <p className="text-red-600 text-sm mt-1" role="alert">{errors.birthday.message}</p>}
          </div>
          <div>
            <label htmlFor="nationality" className="block font-bold mb-2">What is your nationality? *</label>
            <input id="nationality" type="text" {...register("nationality")} aria-invalid={!!errors.nationality} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" />
            {errors.nationality && <p className="text-red-600 text-sm mt-1" role="alert">{errors.nationality.message}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="block font-bold mb-2">Where do you reside?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="addressLine1" className="block text-sm text-gray-600 mb-1">Address Line 1</label>
              <input id="addressLine1" type="text" {...register("addressLine1")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label htmlFor="addressLine2" className="block text-sm text-gray-600 mb-1">Address Line 2 (Optional)</label>
              <input id="addressLine2" type="text" {...register("addressLine2")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm text-gray-600 mb-1">City</label>
              <input id="city" type="text" {...register("city")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm text-gray-600 mb-1">State / Province</label>
              <input id="state" type="text" {...register("state")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm text-gray-600 mb-1">ZIP / Postal Code</label>
              <input id="zip" type="text" {...register("zip")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="languages" className="block font-bold mb-2">Which languages do you speak? *</label>
          <textarea id="languages" {...register("languages")} rows={2} aria-invalid={!!errors.languages} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white"></textarea>
          {errors.languages && <p className="text-red-600 text-sm mt-1" role="alert">{errors.languages.message}</p>}
        </div>
      </section>

      {/* 2. Short Answers */}
      <section className="space-y-6">
        <h2 className="font-fjalla text-2xl uppercase tracking-widest border-b border-gray-200 pb-2">Short Answers</h2>
        
        <div>
          <label htmlFor="film_project" className="block font-bold mb-2">Have you been apart of a film project before?</label>
          <select id="film_project" {...register("film_project")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white">
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="Not yet - this will be my first experience">Not yet - this will be my first experience</option>
            <option value="It&apos;s complicated">It&apos;s complicated</option>
          </select>
        </div>

        <div>
          <label htmlFor="favorite_movie" className="block font-bold mb-2">What is your favorite movie and why? *</label>
          <textarea id="favorite_movie" {...register("favorite_movie")} rows={3} aria-invalid={!!errors.favorite_movie} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white"></textarea>
          {errors.favorite_movie && <p className="text-red-600 text-sm mt-1" role="alert">{errors.favorite_movie.message}</p>}
        </div>

        <div>
          <label htmlFor="traveled" className="block font-bold mb-2">Have you traveled outside of your home country before? If so, where have you traveled? *</label>
          <input id="traveled" type="text" {...register("traveled")} aria-invalid={!!errors.traveled} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" />
          {errors.traveled && <p className="text-red-600 text-sm mt-1" role="alert">{errors.traveled.message}</p>}
        </div>

        <div>
          <label htmlFor="why_youth" className="block font-bold mb-2">Why do you want to work with youth? *</label>
          <textarea id="why_youth" {...register("why_youth")} rows={3} aria-invalid={!!errors.why_youth} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white"></textarea>
          {errors.why_youth && <p className="text-red-600 text-sm mt-1" role="alert">{errors.why_youth.message}</p>}
        </div>

        <div>
          <label htmlFor="passions" className="block font-bold mb-2">What are your passions and hobbies</label>
          <input id="passions" type="text" {...register("passions")} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white" />
        </div>

        <div>
          <label htmlFor="passionate_filmmaking" className="block font-bold mb-2">Why are you passionate about filmmaking or edutainment? *</label>
          <textarea id="passionate_filmmaking" {...register("passionate_filmmaking")} rows={3} aria-invalid={!!errors.passionate_filmmaking} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white"></textarea>
          {errors.passionate_filmmaking && <p className="text-red-600 text-sm mt-1" role="alert">{errors.passionate_filmmaking.message}</p>}
        </div>

        <div>
          <label htmlFor="bring_to_team" className="block font-bold mb-2">Lights, Camera, Learn is a team. What will you bring to our team? *</label>
          <textarea id="bring_to_team" {...register("bring_to_team")} rows={3} aria-invalid={!!errors.bring_to_team} className="w-full border border-gray-300 p-3 bg-gray-50 focus:bg-white"></textarea>
          {errors.bring_to_team && <p className="text-red-600 text-sm mt-1" role="alert">{errors.bring_to_team.message}</p>}
        </div>
      </section>

      {/* 3. Program Preferences */}
      <section className="space-y-6">
        <h2 className="font-fjalla text-2xl uppercase tracking-widest border-b border-gray-200 pb-2">Program Preferences</h2>
        
        <fieldset>
          <legend className="block font-bold mb-3">Which positions are you applying for? *</legend>
          <div className="space-y-2">
            {["Film Director", "Edutainment Director", "Film Editor", "BTS Photographer / Social Media Manager", "BTS Videographer/ Promo Video Director"].map(pos => (
              <label key={pos} className="flex items-center gap-3">
                <input type="checkbox" value={pos} {...register("positions")} className="w-4 h-4 text-black focus:ring-black" />
                <span>{pos}</span>
              </label>
            ))}
          </div>
          {errors.positions && <p className="text-red-600 text-sm mt-2" role="alert">{errors.positions.message}</p>}
        </fieldset>

        <fieldset>
          <legend className="block font-bold mb-3">Which program would you like to be apart of? *</legend>
          <div className="space-y-2">
            {[
              "Sfax, Tunisia: 3rd of July 2022 - 27th of July 2022",
              "Amaz[igh]ing Tunisia: A Journey to the Erased Past"
            ].map(prog => (
              <label key={prog} className="flex items-center gap-3">
                <input type="checkbox" value={prog} {...register("program")} className="w-4 h-4 text-black focus:ring-black" />
                <span>{prog}</span>
              </label>
            ))}
          </div>
          {errors.program && <p className="text-red-600 text-sm mt-2" role="alert">{errors.program.message}</p>}
        </fieldset>
      </section>

      {/* 4. Agreements */}
      <section className="space-y-6">
        <h2 className="font-fjalla text-2xl uppercase tracking-widest border-b border-gray-200 pb-2">Agreements</h2>
        
        <div>
          <label htmlFor="disabilities" className="block font-bold mb-2">Are you a person with disabilities</label>
          <select id="disabilities" {...register("disabilities")} className="w-full md:w-1/2 border border-gray-300 p-3 bg-gray-50 focus:bg-white">
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="bg-gray-50 p-6 space-y-6 border border-gray-200">
          <div>
            <p className="mb-3">Lights, Camera, Learn&apos;s International Internship Programs are not free. We provide hands-on training in the field of edutainment and you will incur all costs associated with traveling on this trip. If this program is too costly for you, please inquire more about our available scholarships. *</p>
            <label className="flex items-center gap-3 font-bold">
              <input type="checkbox" {...register("costs_agreement")} aria-invalid={!!errors.costs_agreement} className="w-5 h-5 text-black focus:ring-black" />
              I understand.
            </label>
            {errors.costs_agreement && <p className="text-red-600 text-sm mt-1" role="alert">{errors.costs_agreement.message}</p>}
          </div>

          <div>
            <p className="mb-3">Lights, Camera, Learn&apos;s International Internship Programs are both mentally and physically demanding. Interns must be prepared to be active for long hours, travel between cities and locations for many weeks, and be on their feet all day. Please check the box to confirm that you understand the physical requirements of the internship. *</p>
            <label className="flex items-center gap-3 font-bold">
              <input type="checkbox" {...register("physical_agreement")} aria-invalid={!!errors.physical_agreement} className="w-5 h-5 text-black focus:ring-black" />
              I understand.
            </label>
            {errors.physical_agreement && <p className="text-red-600 text-sm mt-1" role="alert">{errors.physical_agreement.message}</p>}
          </div>

          <div>
            <p className="mb-3">Lights, Camera, Learn interns will be expected to sign a liability contract, media release and confirmatory agreement before the start of the internship. Please check the box to confirm that you understand the legal requirements of the International Internship Program. *</p>
            <label className="flex items-center gap-3 font-bold">
              <input type="checkbox" {...register("legal_agreement")} aria-invalid={!!errors.legal_agreement} className="w-5 h-5 text-black focus:ring-black" />
              I understand.
            </label>
            {errors.legal_agreement && <p className="text-red-600 text-sm mt-1" role="alert">{errors.legal_agreement.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="how_did_you_hear" className="block font-bold mb-2">How did you hear about Lights, Camera, Learn&apos;s International Internship Program? *</label>
          <select id="how_did_you_hear" {...register("how_did_you_hear")} aria-invalid={!!errors.how_did_you_hear} className="w-full md:w-1/2 border border-gray-300 p-3 bg-gray-50 focus:bg-white">
            <option value="">Select...</option>
            <option value="Friend/Family">Friend/Family</option>
            <option value="Referral">Referral</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="University">University</option>
            <option value="Other">Other</option>
          </select>
          {errors.how_did_you_hear && <p className="text-red-600 text-sm mt-1" role="alert">{errors.how_did_you_hear.message}</p>}
        </div>
      </section>

      {/* Submit / Captcha */}
      <div className="pt-8 border-t border-gray-200 flex flex-col items-center">
        <div className="mb-6">
          <Turnstile 
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} 
            onSuccess={(token) => setValue("cfTurnstileResponse", token, { shouldValidate: true })}
            onError={() => setServerError("Spam protection challenge failed.")}
          />
          {errors.cfTurnstileResponse && <p className="text-red-600 text-sm mt-2 text-center" role="alert">{errors.cfTurnstileResponse.message}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-black text-white px-12 py-4 font-fjalla text-xl uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
