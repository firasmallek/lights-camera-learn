"use server";

import { z } from "zod";

const schoolSchema = z.object({
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
  cfTurnstileResponse: z.string().min(1, "Turnstile verification failed"),
});

const googleFormResponseUrl = "https://docs.google.com/forms/d/e/1FAIpQLScPmk2uuvTKAZnqktwqUCrSGTtlp_YgXnYOKJ2NaBg4NtvdOw/formResponse";

export async function submitSchoolForm(data: unknown) {
  const parsed = schoolSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data.", details: parsed.error.format() };
  }

  const { cfTurnstileResponse, ...formData } = parsed.data;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret && process.env.NODE_ENV === "production") {
    return { success: false, error: "Spam protection is not configured. Please try again later." };
  }

  if (turnstileSecret) {
    const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: turnstileSecret, response: cfTurnstileResponse }).toString(),
    });
    const turnstileData = await turnstileResponse.json();
    if (!turnstileData.success && process.env.NODE_ENV === "production") {
      return { success: false, error: "Spam protection verification failed. Please try again." };
    }
  }

  const googleFormData = new URLSearchParams({
    "entry.1295347395": formData.firstName,
    "entry.584665774": formData.lastName,
    "entry.353506419": formData.title,
    "entry.1896790447": formData.email,
    "entry.221880633": formData.school,
    "entry.100727343": formData.country,
    "entry.824369839": formData.addressLine1,
    "entry.1584044641": formData.city,
    "entry.1577554863": formData.state,
    "entry.1907380750": formData.zip,
    "entry.1308386741": formData.details,
  });
  if (formData.addressLine2) googleFormData.append("entry.1329716218", formData.addressLine2);

  try {
    const response = await fetch(googleFormResponseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: googleFormData.toString(),
    });
    if (!response.ok) throw new Error(`Google Form submission failed with status ${response.status}`);
    return { success: true };
  } catch (error) {
    console.error("School Google Form submission error:", error);
    return { success: false, error: "We could not submit the form. Please try again." };
  }
}
