import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import * as converter from "json-2-csv";

function initializeGoogleAI() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY not found in environment");
  return new ChatGoogleGenerativeAI({
    model: process.env.GOOGLE_AI_MODEL || "gemini-1.5-pro-latest",
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

  for (const { fileBuffer, fileName, fileType } of files) {
    console.log(`📄 Processing: ${fileName} (${fileType})`);

    const base64Data = fileBuffer.toString("base64");

    // LangChain backend için doğru format → inlineData
    const message = new HumanMessage({
      content: [
        { type: "text", text: profile.prompt },
        {
          type: fileType || "application/pdf",
          data: base64Data,
        },
      ],
    });

    try {
      const result = await structuredModel.invoke([message]);
      console.log(`✅ AI processed ${fileName}`);
      allResults.push(...(Array.isArray(result) ? result : [result]));
    } catch (err) {
      console.error(`⚠️ AI failed for ${fileName}:`, err.message);
      allResults.push({ ...profile.fallbackTemplate, source: fileName });
    }
  }

  const endTime = Date.now();
  const processingTime = `${((endTime - startTime) / 1000).toFixed(1)}s`;

  let csv;
  try {
    csv = converter.json2csv(allResults, profile.csvConversionOptions || {});
  } catch (csvErr) {
    csv = "Error converting to CSV: " + csvErr.message;
  }

  return { json: allResults, csv, processingTime, totalFiles: files.length };
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
