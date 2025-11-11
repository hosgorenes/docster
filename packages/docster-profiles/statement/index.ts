import type { IProfile } from "../types/profile";
import { z } from "zod";

export class Statement implements IProfile {
  public profileName = "Statement";
  public acceptedFileTypes = ["application/pdf"];
  public providers = ["GoogleAI"];

  public prompt = `
    You are provided with a bank or investment account statement document (Excel or PDF).
    
    Your task is to extract every transaction in structured JSON format.
    Each row in the document corresponds to one transaction.
    
    Fields to Extract:
    
    1. portfolioInformation
    2. depotNumber
    3. portfolioDescription
    4. transactionId
    5. transactionType
    6. transactionDate
    7. externalBookingDate
    8. valueDate
    9. titleAccount
    10. currency
    11. description
    12. amount
    13. price
    14. costPrice
    15. fee
    16. accruedInterest
    17. bookingText
    18. accountDescription
    
    Formatting Rules:
    - If a field is blank or missing, return it as null.
    - Dates must be formatted as YYYY-MM-DD.
    - Numeric values (amount, price, costPrice, fee, accruedInterest) must be numbers.
    - Use negative numbers for outflows and positive for inflows.
    - Keep text exactly as in the original language.
    - The final output must be a JSON array of objects, one per transaction.
    
    Debit and Credit Handling:
    - In statements with both debit and credit columns, 
      treat the first numeric column (typically showing outflow) as "amount", 
      and the second numeric column (typically showing inflow) as "price". 
      If either value is 0.00, set that field to null.
    
    Cost Calculation:
    - The "costPrice" field must represent the total transaction value, 
      typically calculated as (amount × price) if both fields are available.
    - If only one of them is provided, keep the available value.
    
    Expense (Fee) Merging:
    - If a line represents a fee, commission, or service charge (e.g. "saklama ücreti", "komisyon", "işlem masrafı"),
      and another line on the same date refers to the main transaction (e.g. "satış", "alış", "transfer"),
      merge them into a single JSON object.
    - Keep the main transaction description and assign the fee value to the "fee" field.
    - Do not create a separate JSON object for the expense line.
    `;


  public schema = z.array(
    z.object({
      portfolioInformation: z.string().nullable(),
      depotNumber: z.string().nullable(),
      portfolioDescription: z.string().nullable(),
      transactionId: z.string().nullable(),
      transactionType: z.string().nullable(),
      transactionDate: z.string().nullable(),
      externalBookingDate: z.string().nullable(),
      valueDate: z.string().nullable(),
      titleAccount: z.string().nullable(),
      currency: z.string().nullable(),
      description: z.string().nullable(),
      amount: z.number().nullable(),
      price: z.number().nullable(),
      costPrice: z.number().nullable(),
      fee: z.number().nullable(),
      accruedInterest: z.number().nullable(),
      bookingText: z.string().nullable(),
      accountDescription: z.string().nullable(),
    })
  );

  public csvConversionOptions = {
    unwindArrays: true,
    expandArrayObjects: true,
    prependHeader: true,
    trimFieldValues: true,
    trimHeaderFields: true,
  };

  public fallbackTemplate = {
    transactionId: "N/A",
    transactionDate: null,
    description: "AI processing failed",
    currency: "TRY",
    amount: 0,
  };
}
