import type { IProfile } from "../types/profile";
import { z } from "zod";

export class Statement implements IProfile {
    public profileName = "Statement";
    public acceptedFileTypes = ["application/pdf",];
    public providers = ["GoogleAI"];

    public prompt = `
You are provided with a bank account statement document (Excel or PDF).

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
15. accruedInterest
16. bookingText
17. accountDescription

Formatting Rules:
- If a field is blank or missing, return it as null.
- Dates must be formatted as YYYY-MM-DD.
- Numeric values (amount, price, costPrice, accruedInterest) must be numbers.
- Use negative numbers for outflows and positive for inflows.
- Keep text exactly as in the original language.
- The final output must be a JSON array of objects, one per transaction.
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
