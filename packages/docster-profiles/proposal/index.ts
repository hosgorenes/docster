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
    A 2-letter or 3-letter currency code (e.g., USD, EUR, TRY, TL).
    Typically located near financial values.
    If not found, return null.

    4. Total Value of the Agreement/Proposal
    Only return a total value if it is explicitly stated as the total or lump sum for the agreement.
    Do not calculate the total by summing up per-product prices unless the document clearly specifies quantities or a full-package value.
    If no total is clearly stated, return 0.

    Product-Level Breakdown:

    If the document includes multiple products, extract them into an array.
    Each product should include:

    - Name (if available),
    - Price: a numeric value (set to 0 if not provided).
    - Remarks: a short string (e.g., delivery terms, payment timing), or null if not present.

    Important Notes on Product Extraction:

    - Prices mentioned alongside descriptions of different services/tasks are typically per-product values — not full agreement totals.
    - If multiple services or deliverables are listed with separate prices, treat each one as a distinct product.
    - Ignore discount lines or negative price entries.
    - Do not assume any quantity or total commitment for these items unless explicitly stated. Products listed with per-unit prices are optional or on-demand, and should not influence the total value.

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
