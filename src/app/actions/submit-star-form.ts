"use server";

import { z } from "zod";

const starSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  age: z.string().min(1, "Age is required"),
  location: z.string().min(1, "Location is required"),
  cfTurnstileResponse: z.string().optional(),
});

const googleFormResponseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSf21HcR0gYSRd0zdUvBUcTff_rHn4hHbnzuSN9yoatlEEVEHQ/formResponse";

export async function submitStarForm(data: unknown) {
  const parsed = starSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data.", details: parsed.error.format() };
  }

  const { cfTurnstileResponse, ...formData } = parsed.data;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";

  if (cfTurnstileResponse && cfTurnstileResponse !== "skip" && process.env.TURNSTILE_SECRET_KEY) {
    try {
      const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: turnstileSecret, response: cfTurnstileResponse }).toString(),
      });
      const turnstileData = await turnstileResponse.json();
      if (!turnstileData.success && process.env.NODE_ENV === "production") {
        return { success: false, error: "Spam protection verification failed. Please try again." };
      }
    } catch (e) {
      console.warn("Turnstile check warning:", e);
    }
  }

  const googleFormData = new URLSearchParams({
    "entry.1285873752": formData.firstName,
    "entry.2066727846": formData.lastName,
    "entry.175400250": formData.email,
    "entry.1189895833": formData.age,
    "entry.264761240": formData.location,
  });
  if (formData.phone) googleFormData.append("entry.707865087", formData.phone);

  try {
    const response = await fetch(googleFormResponseUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0"
      },
      body: googleFormData.toString(),
    });
    if (!response.ok) throw new Error(`Google Form submission failed with status ${response.status}`);
    return { success: true };
  } catch (error) {
    console.error("Star Google Form submission error:", error);
    return { success: false, error: "We could not submit the form. Please try again." };
  }
}
