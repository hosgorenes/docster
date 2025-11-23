import type { IProfile } from "../types/profile";
import { z } from "zod";
import { HVAC_STRINGS } from "./strings";

export class HVAC implements IProfile {
  public profileName = HVAC_STRINGS.profileName;
  public acceptedFileTypes = HVAC_STRINGS.acceptedFileTypes;
  public providers = HVAC_STRINGS.providers;

  public prompt = HVAC_STRINGS.prompt;

  public requiredKeys = HVAC_STRINGS.requiredKeys;

  public schema = z.array(
    z.object({
      supplyAirFlow: z
        .array(
          z.object({
            projectName: z.string().optional(),
            ahuName: z.string(),
            value: z.number(),
            unit: z.enum(["l/s", "m3/h"]),
            confidence: z.number().gte(0).lte(1),
          })
        )
        .optional(),
      returnAirFlow: z
        .array(
          z.object({
            projectName: z.string().optional(),
            ahuName: z.string(),
            value: z.number(),
            unit: z.enum(["l/l", "m3/h"]),
            confidence: z.number().gte(0).lte(1),
          })
        )
        .optional(),
      supplyStaticPD: z
        .array(
          z.object({
            projectName: z.string().optional(),
            ahuName: z.string(),
            value: z.number(),
            unit: z.enum(["Pa"]),
            confidence: z.number().gte(0).lte(1),
          })
        )
        .optional(),
      returnStaticPD: z
        .array(
          z.object({
            projectName: z.string().optional(),
            ahuName: z.string(),
            value: z.number(),
            unit: z.enum(["Pa"]),
            confidence: z.number().gte(0).lte(1),
          })
        )
        .optional(),
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
    supplyAirFlow: [
      {
        projectName: "",
        ahuName: "Unknown AHU",
        value: 0,
        unit: "l/s",
        confidence: 0,
      },
    ],
    returnAirFlow: [
      {
        projectName: "",
        ahuName: "Unknown AHU",
        value: 0,
        unit: "l/s",
        confidence: 0,
      },
    ],
    supplyStaticPD: [
      {
        projectName: "",
        ahuName: "Unknown AHU",
        value: 0,
        unit: "Pa",
        confidence: 0,
      },
    ],
    returnStaticPD: [
      {
        projectName: "",
        ahuName: "Unknown AHU",
        value: 0,
        unit: "Pa",
        confidence: 0,
      },
    ],
  };
}
