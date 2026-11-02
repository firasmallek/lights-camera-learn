import { NextResponse } from 'next/server';
import { submitApplication } from '@/app/actions/submit-application';

interface SquarespaceField {
  title?: string;
  value?: string | Record<string, string> | string[];
}

export async function POST(req: Request) {
  try {
    const rawText = await req.text();
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = {};
    }
    
    const pagePath = typeof payload.pagePath === 'string' ? payload.pagePath : '';
    const isInternship = pagePath === '/apply-2' || pagePath === '/internship-application' || rawText.includes("What's your name?") || rawText.includes("preferred pronouns");
    
    if (isInternship) {
      let formFields: SquarespaceField[] = [];
      if (typeof payload.form === 'string') {
        try {
          formFields = JSON.parse(payload.form);
        } catch (e) {
          void e;
        }
      } else if (Array.isArray(payload.form)) {
        formFields = payload.form;
      }

      const getValue = (titleContains: string) => {
        const field = formFields.find((f: SquarespaceField) => typeof f.title === 'string' && f.title.toLowerCase().includes(titleContains.toLowerCase()));
        return field ? field.value : "";
      };
      
      const getName = (titleContains: string) => {
        const field = formFields.find((f: SquarespaceField) => typeof f.title === 'string' && f.title.toLowerCase().includes(titleContains.toLowerCase()));
        if (!field || !field.value) return "";
        if (typeof field.value === 'object' && !Array.isArray(field.value)) {
          return `${field.value.firstName || ''} ${field.value.lastName || ''}`.trim();
        }
        return typeof field.value === 'string' ? field.value : "";
      };
      
      const getAddress = (titleContains: string) => {
        const field = formFields.find((f: SquarespaceField) => typeof f.title === 'string' && f.title.toLowerCase().includes(titleContains.toLowerCase()));
        if (!field || !field.value) return {};
        if (typeof field.value === 'object' && !Array.isArray(field.value)) {
          return {
            addressLine1: field.value.address1 || "",
            addressLine2: field.value.address2 || "",
            city: field.value.city || "",
            state: field.value.state || "",
            zip: field.value.zip || "",
            country: field.value.country || ""
          };
        }
        return { addressLine1: typeof field.value === 'string' ? field.value : "" };
      };

      const getCheckbox = (titleContains: string) => {
        const val = getValue(titleContains);
        if (Array.isArray(val)) return val;
        if (typeof val === 'string' && val.length > 0) return [val]; 
        return [];
      };

      const addressObj = getAddress("address");

      const mappedData = {
        name: getName("name") || "",
        pronouns: (getValue("pronoun") || "") as string,
        email: (getValue("email") || "") as string,
        phone: (getValue("phone") || "") as string,
        birthday: (getValue("birthday") || "") as string,
        nationality: (getValue("nationality") || "") as string,
        addressLine1: addressObj.addressLine1 || "",
        addressLine2: addressObj.addressLine2 || "",
        city: addressObj.city || "",
        state: addressObj.state || "",
        zip: addressObj.zip || "",
        languages: (getValue("language") || "") as string,
        film_project: (getValue("film project") || "") as string,
        favorite_movie: (getValue("favorite movie") || "") as string,
        traveled: (getValue("traveled") || "") as string,
        why_youth: (getValue("youth") || "") as string,
        passions: (getValue("passion") || "") as string,
        passionate_filmmaking: (getValue("filmmaking") || "") as string,
        bring_to_team: (getValue("bring") || "") as string,
        positions: getCheckbox("positions") as string[],
        program: getCheckbox("program") as string[],
        disabilities: (getValue("disabilit") || "") as string,
        costs_agreement: getValue("free") || getValue("cost") ? true : false,
        physical_agreement: getValue("physic") ? true : false,
        legal_agreement: getValue("liability") || getValue("legal") ? true : false,
        how_did_you_hear: (getValue("hear") || "") as string,
        cfTurnstileResponse: "skip"
      };
      
      const result = await submitApplication(mappedData);
      
      if (result.success) {
        return NextResponse.json({ result: "success" });
      } else {
        return NextResponse.json({ error: result.error || "Submission failed", details: (result as Record<string, unknown>).details }, { status: 400 });
      }
    } else {
      // Newsletter or other contact form submission
      console.log("Form submission received (newsletter/other):", JSON.stringify(payload));
      return NextResponse.json({ result: "success" });
    }
  } catch (err) {
    console.error("Intercept error:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
