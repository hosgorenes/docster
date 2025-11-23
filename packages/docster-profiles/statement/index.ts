import type { IProfile } from "../types/profile";
import { z } from "zod";
import { STATEMENT_STRINGS } from "./strings";

export class Statement implements IProfile {
  public profileName = STATEMENT_STRINGS.profileName;
  public acceptedFileTypes = STATEMENT_STRINGS.acceptedFileTypes;
  public providers = STATEMENT_STRINGS.providers;

  public prompt = STATEMENT_STRINGS.prompt;

  // REQUIRED KEYS
  public requiredKeys = STATEMENT_STRINGS.requiredKeys;

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
