import type { IProfile } from "../types";
import { z } from "zod";

export class Proposal implements IProfile {
  public profileName = "Proposal";
  public acceptedFileTypes = ["application/pdf"];
  public providers = ["GoogleAI"];
  public prompt = `
    Attached are proposals or their agreements, extract the following information and return them as a JSON payload.

    - Vendor name: Vendor is the person or legal entity who provides the services. Don't confuse it with the entity the services are provided for. Don't return unless stated clearly.
    - Agreement name
    - Value of the agreement or proposal: Unless present return 0 (zero)
    - Currency of the agreement or proposal: Currencies are 2 (two) or 3 (three) letter values. That are often mentioned close the financial values.

    Each proposal or agreement can contain multiple products, in that case include an object array in the response json and specify each ones price individually. Prices should always be a number and set to 0 (zero) if not present.
    If each product has a special conditipon include that in a separate property. Unless present set it to null.
    If there are multiple products the sum value of the proposal should match the sum of individual products.

    All textual data should be returned in their original language; no translation should be done.
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
