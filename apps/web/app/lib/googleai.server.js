import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as converter from "json-2-csv";

function initializeGoogleAI() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY not found in environment");
  return new ChatGoogleGenerativeAI({
    model: process.env.GOOGLE_AI_MODEL || "gemini-2.5-pro",
    temperature: 0.3,
    maxOutputTokens: 10000,
    apiKey,
  });
}

export async function processDocumentsWithAI(files, profile) {
  const model = initializeGoogleAI();
  const structuredModel = model.withStructuredOutput(profile.schema, {
    name: "docster_processing",
  });

  const startTime = Date.now();
  const allResults = [];

  for (let index = 0; index < files.length; index++) {
    const entry = files[index];
    const { fileBuffer, fileName, fileType } = entry ?? {};

    if (!entry || !Buffer.isBuffer(fileBuffer)) {
      throw new Error(`Invalid file buffer received at index ${index}`);
    }

    const resolvedFileName = fileName || `document-${index + 1}.pdf`;
    const resolvedMimeType = fileType || "application/pdf";

    const base64Data = fileBuffer.toString("base64");

    const messageContent = [
      { type: "text", text: profile.prompt },
      {
        type: resolvedMimeType,
        data: base64Data,
      },
    ];

    try {
      const result = await structuredModel.invoke([
        {
          role: "user",
          content: messageContent,
        },
      ]);

      console.log("✅ AI processing result:", {
        file: resolvedFileName,
        result,
      });

      // Normalize result items against profile fallback template
      const normalizeItem = (item = {}) => {
        const base = { ...(profile.fallbackTemplate || {}) };
        // ensure undefined values become null for schema validation
        for (const key of Object.keys(base)) {
          if (item[key] === undefined) {
            item[key] = base[key] ?? null;
          }
        }
        return { ...base, ...item, source: resolvedFileName };
      };

      if (Array.isArray(result) && result.length > 0) {
        allResults.push(...result.map((r) => normalizeItem(r)));
      } else if (result) {
        allResults.push(normalizeItem(result));
      } else {
        allResults.push(normalizeItem({}));
      }
    } catch (aiError) {
      console.error(
        `⚠️ AI processing failed for ${resolvedFileName}:`,
        aiError
      );
      allResults.push({
        ...profile.fallbackTemplate,
        source: resolvedFileName,
      });
    }
  }

  const endTime = Date.now();
  const processingTime = `${((endTime - startTime) / 1000).toFixed(1)}s`;

  let validatedResults;
  try {
    validatedResults = profile.schema.parse(allResults);
  } catch (validationError) {
    console.error("schema validation failed:", validationError);
    validatedResults = allResults;
  }

  let csv;
  try {
    csv = converter.json2csv(
      validatedResults,
      profile.csvConversionOptions || {}
    );
  } catch (csvErr) {
    csv = "Error converting to CSV: " + csvErr.message;
  }

  return {
    json: validatedResults,
    csv,
    processingTime,
    totalFiles: files.length,
  };
}

export async function fallbackProcessing(files, profile) {
  const fallback = files.map((f) => ({
    ...profile.fallbackTemplate,
    source: f.fileName || "unknown",
  }));

  let csv = "";
  try {
    csv = converter.json2csv(fallback, {});
  } catch (e) {
    csv = "Error converting to CSV: " + e.message;
  }

  return { json: fallback, csv, processingTime: "1.0s", totalFiles: files.length };
}
