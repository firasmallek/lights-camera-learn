"use server";

import { z } from "zod";

const applicationSchema = z.object({
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
  film_project: z.enum(["Yes", "Not yet - this will be my first experience", "It's complicated"]).optional(),
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
  cfTurnstileResponse: z.string().min(1, "Turnstile verification failed")
});

const googleFormResponseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc5rSiffSe24O0xEA68SLVUjNkyyw4-SSrWhbSnKKiqdibCYQ/formResponse";

type ApplicationData = Omit<z.infer<typeof applicationSchema>, "cfTurnstileResponse">;

async function submitToGoogleForm(formData: ApplicationData) {
  const googleFormData = new URLSearchParams();
  const add = (entry: string, value: string | undefined) => {
    if (value) googleFormData.append(entry, value);
  };

  add("entry.689762424", formData.name);
  add("entry.1132242182", formData.pronouns);
  add("entry.316136939", formData.email);
  add("entry.1306164221", formData.phone);
  add("entry.2127327475", formData.birthday);
  add("entry.463370288", formData.nationality);
  add("entry.1178005245", formData.addressLine1);
  add("entry.777570682", formData.addressLine2);
  add("entry.1386301814", formData.city);
  add("entry.1496090357", formData.state);
  add("entry.2085431263", formData.zip);
  add("entry.337934406", formData.languages);
  add("entry.13463708", formData.film_project);
  add("entry.1130208775", formData.favorite_movie);
  add("entry.1720743023", formData.traveled);
  add("entry.1567726044", formData.why_youth);
  add("entry.1517249501", formData.passions);
  add("entry.764685075", formData.passionate_filmmaking);
  add("entry.1449878167", formData.bring_to_team);
  formData.positions.forEach((position) => add("entry.948068760", position));
  formData.program.forEach((program) => add("entry.817191573", program));
  add("entry.1357031227", formData.disabilities);
  add("entry.790084750", formData.costs_agreement ? "I understand that Lights, Camera, Learn's International Internship Programs are not free. I will incur all costs associated with traveling on this trip." : undefined);
  add("entry.1680251043", formData.physical_agreement ? "I understand that the internship is mentally and physically demanding and requires long hours, travel, and being on my feet all day." : undefined);
  add("entry.331469201", formData.legal_agreement ? "I understand that interns must sign a liability contract, media release, and confirmatory agreement before the internship." : undefined);
  add("entry.405946877", formData.how_did_you_hear);

  const response = await fetch(googleFormResponseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: googleFormData.toString(),
  });

  if (!response.ok) {
    throw new Error(`Google Form submission failed with status ${response.status}`);
  }
}

export async function submitApplication(data: unknown) {
  const parsed = applicationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data.", details: parsed.error.format() };
  }

  const { cfTurnstileResponse, ...formData } = parsed.data;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  if (!turnstileSecret && process.env.NODE_ENV === "production") {
    return { success: false, error: "Spam protection is not configured. Please try again later." };
  }

  if (turnstileSecret) {
    const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: cfTurnstileResponse,
      }).toString(),
    });

    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success && process.env.NODE_ENV === "production") {
      return { success: false, error: "Spam protection verification failed. Please try again." };
    }
  }

  try {
    await submitToGoogleForm(formData);
    return { success: true };
  } catch (error) {
    console.error("Google Form submission error:", error);
    return { success: false, error: "We could not submit your application. Please try again." };
  }
}
