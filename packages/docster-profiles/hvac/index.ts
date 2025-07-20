import type { IProfile } from "../types";
import { z } from "zod";

export class HVAC implements IProfile {
  public profileName = "HVAC";
  public acceptedFileTypes = ["application/pdf"];
  public providers = ["GoogleAI"];
  public prompt = `
    You are provided with documents containing specifications from HVAC (Heating, Ventilating, and Air Conditioning) projects.

    Your task is to extract specific technical data related to air handling units (AHUs) and return it in structured JSON format.
    Always return a valid JSON.

    Instructions:

    Extract the following data points: Supply Air Flow, Return Air Flow, SupplyStaticPD, ReturnStaticPD

    For each value you extract, associate it with its corresponding AHU (Air Handling Unit).
    The AHU may also be referred to as the air system name. Do not confuse the AHU name with the overall project name.
    Preserve all textual data in its original language. Do not translate any labels or values.

    For each extracted AHU block, also include: the project name and a confidence score (between 0 and 1) representing how certain you are about the
    correctness of the extracted data for that AHU.

    Field Matching Guide for Data Points:

    1. Supply Air Flow:
    This value might appear under any of the following labels:

    "SupplyAirFlow", "Hava debisi", "Üfleme debisi", "Besleme debisi"
    "Supply flow rate", "Air flow Supply", "Fan Sizing Data Standard"
    "Design Supply Airflow", "Veriş (Üfleme) Fanı", "Hava Debisi"

    Accept units such as m³/h, m³/s, L/s.

    2. Return Air Flow:
    This value might appear under:

    "Emiş debisi", "Dönüş debisi", "Return flow rate"
    "Veriş/Dönüş Hava Debisi", "Dönüş Fanı Hava Debisi"

    Accept units such as m³/h, m³/s, L/s.

    3. SupplyStaticPD:
   	This value may appear under:

    "Duct pressure", "Supply duct pressure",
    "Static pressure drop",	"Kanal basıncı",	"Cihaz Dışı Statik Basınç"

    Accept units such as Pa

    4. ReturnStaticPD:
    This value may appear under:

    "ReturnStaticPD",	"Return duct pressure",
    "Return static pressure drop", "Dönüş kanal basıncı"

    Accept units such as Pa.
  `;
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
            unit: z.enum(["l/s", "m3/h"]),
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
}
