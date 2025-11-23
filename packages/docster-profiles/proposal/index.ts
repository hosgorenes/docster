import type { IProfile } from "../types/profile";
import { z } from "zod";
import { PROPOSAL_STRINGS } from "./strings";

export class Proposal implements IProfile {
  public profileName = PROPOSAL_STRINGS.profileName;
  public acceptedFileTypes = PROPOSAL_STRINGS.acceptedFileTypes;
  public providers = PROPOSAL_STRINGS.providers;

  public prompt = PROPOSAL_STRINGS.prompt;

  public requiredKeys = PROPOSAL_STRINGS.requiredKeys;

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

  public fallbackTemplate = {
    vendorName: "Unknown Vendor",
    agreementName: "",
    proposalValue: 0,
    proposalCurrency: "TRY",
    products: [],
  };
}
