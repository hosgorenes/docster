export const PROPOSAL_STRINGS = {
    profileName: "Proposal",

    acceptedFileTypes: ["application/pdf"],
    providers: ["GoogleAI"],

    requiredKeys: [
        "vendorName",
        "agreementName",
        "proposalValue",
        "proposalCurrency",
        "products",
    ],

    prompt: `
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
  Do not calculate the total by summing up per-product prices unless quantities are clearly stated.
  
  Product-Level Breakdown:
  Extract products into an array with:
  - productName
  - productProposalValue
  - productRemarks
  
  Additional Notes:
  - Keep all text in original language.
  - If a value is not explicitly stated, use fallbacks (0 or null).
  - Ensure numerical accuracy and structured JSON output.
  `,
};
