import type { IProfile } from "../types";
import { z } from "zod";

export class Proposal implements IProfile {
  public profileName = "Isbank";
  public acceptedFileTypes = ["application/pdf"];
  public providers = ["GoogleAI"];
  public prompt = `
    Attached are proposals or their agreements, extract the following information and return them as a JSON payload.

    - Vendor name
    - Agreement name
    - Value of the agreement or proposal
    - Currency of the agreement or proposal

    Each proposal or agreement can contain multiple products, in that case include an object array in the response json and specify each ones price individually.
    If each product has a special conditipon include that in a separate property. if not set it to null.
    If there are multiple products the sum value of the proposal should match the sum of individual products.
  `;
  public schema = z.array(
    z.object({
      vendorName: z.string(),
      agreementName: z.string(),
      proposalValues: z.number(),
      proposalCurrency: z.string(),
      products: z.array(
        z.object({
          productName: z.string(),
          productProposalValue: z.string(),
          productRemarks: z.string(),
        })
      ),
    })
  );
  public csvConversionOptions = {};
}
