import type { IProfile } from "../types";
import { z } from "zod";

export class Proposal implements IProfile {
  public profileName = "Proposal";
  public acceptedFileTypes = ["application/pdf"];
  public providers = ["GoogleAI"];
  public prompt = `
    You are provided with documents that are either proposals or agreements.

    Your task is to extract key commercial information and return it in structured JSON format, following the rules below.

    Fields to Extract:

    1. Vendor Name
    The vendor is the person or legal entity providing the services.
    Do not confuse the vendor with the client or the party receiving the services.
    Only return the vendor name if it is explicitly stated in the document.

    2. Agreement or Proposal Name
    Total Value of the Agreement/Proposal
    If not present, return 0.
    Must always be a numeric value (no formatting or symbols).

    3. Currency
    A 2- or 3-letter currency code (e.g., USD, EUR, TRY, TL).
    Typically located near financial values.
    If not found, return null.

    Product-Level Breakdown:

    If the document includes multiple products, extract them into an array.
    Each product should include:

    - Name (if available),
    - Price: a numeric value (set to 0 if not provided), ignore the discounts displayed as products with negative price values.
    - Remarks: a short string (e.g., delivery terms, payment timing), or null if not present.

    The sum of all product prices must match the total value of the proposal/agreement.

    Additional Notes:

    - Return all text in its original language — no translations.
    - If a value is not explicitly stated, follow the fallback rule (e.g., 0 or null as specified).
    - Ensure consistency and numerical accuracy in totals and product breakdowns.
  `;
  public schema = z.array(
    z.object({
      vendorName: z.string(),
      agreementName: z.string(),
      proposalValue: z.number().default(0),
      proposalCurrency: z.string(),
      products: z.array(
        z.object({
          productName: z.string(),
          productProposalValue: z.number().default(0),
          productRemarks: z.string(),
        })
      ),
    })
  );
  public csvConversionOptions = {
    unwindArrays: true,
    expandArrayObjects: true,
    prependHeader: true,
    trimFieldValues: true,
    trimHeaderFields: true,
  };
}
