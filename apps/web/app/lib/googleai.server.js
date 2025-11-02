import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import * as converter from "json-2-csv";

// Initialize Google AI model
function initializeGoogleAI() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new Error(
      " [REDACTED]is required but not found in environment variables"
    );
  }

  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    temperature: 0.3,
    maxOutputTokens: 10000,
    apiKey: apiKey,
  });
}

// Convert file to base64
function fileToBase64(buffer) {
  return buffer.toString("base64");
}

// Process documents with Google AI using Profile
export async function processDocumentsWithAI(files, profile) {
  try {
    const model = initializeGoogleAI();
    const startTime = Date.now();

    // Create structured output model using the Profile schema
    const structuredModel = model.withStructuredOutput(profile.schema, {
      name: "proposal_extraction",
    });

    // Process each file
    const allResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file || !(file instanceof File)) {
        throw new Error(`Invalid file at index ${i}`);
      }

      console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);

      // Convert file to buffer and then to base64
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Content = fileToBase64(buffer);

      // Create message content with base64 PDF
      const messageContent = [
        {
          type: "text",
          text: profile.prompt,
        },
        {
          type: "media",
          mimeType: file.type,
          data: base64Content,
        },
      ];

      try {
        // Process with structured output
        const result = await structuredModel.invoke([
          {
            role: "user",
            content: messageContent,
          },
        ]);

        console.log("AI processing result:", result);

        // If result is an array, add to allResults, otherwise wrap in array
        if (Array.isArray(result)) {
          allResults.push(...result);
        } else {
          allResults.push(result);
        }
      } catch (aiError) {
        console.error(`AI processing failed for ${file.name}:`, aiError);
        // Add fallback result for this file using the profile's fallback template
        allResults.push({
          ...profile.fallbackTemplate,
          source: file.name,
        });
      }
    }

    const endTime = Date.now();
    const processingTime = `${((endTime - startTime) / 1000).toFixed(1)}s`;

    // Validate results with the schema
    let validatedResults;
    try {
      validatedResults = profile.schema.parse(allResults);
    } catch (validationError) {
      console.error("Schema validation failed:", validationError);
      // Return the results even if validation fails, but log the error
      validatedResults = allResults;
    }

    // Merge fee rows into the same-date main transaction (user's approach)
    if (profile.profileName === "Statement" && Array.isArray(validatedResults)) {
      const mergedData = [];
      const tempByDate = {};

      for (const row of validatedResults) {
        const dateKey = row?.transactionDate || "unknown";

        if (/ücret|fee|komisyon|saklama/i.test(String(row?.description || ""))) {
          if (tempByDate[dateKey]) {
            const feeValue = Math.abs(Number(row?.amount ?? row?.price ?? 0) || 0);
            const currentFee = Number(tempByDate[dateKey].fee || 0);
            tempByDate[dateKey].fee = Number((currentFee + feeValue).toFixed(2));
          }
        } else {
          tempByDate[dateKey] = { ...row, fee: row?.fee ?? tempByDate[dateKey]?.fee ?? null };
        }
      }

      for (const key of Object.keys(tempByDate)) {
        mergedData.push(tempByDate[key]);
      }

      validatedResults = mergedData;
    }

    // Convert JSON to CSV using ProposalProfile options
    let csvData;
    try {
      const csvOptions = {
        ...profile.csvConversionOptions,
      };

      csvData = converter.json2csv(validatedResults, csvOptions);
      console.log("CSV conversion successful");
    } catch (csvError) {
      console.error("CSV conversion failed:", csvError);
      csvData = "Error converting to CSV: " + csvError.message;
    }

    return {
      json: validatedResults,
      csv: csvData,
      processingTime,
      totalFiles: files.length,
    };
  } catch (error) {
    console.error("Error processing documents:", error);
    throw new Error(`Document processing failed: ${error.message}`);
  }
}

// Fallback processing function (without AI)
export async function fallbackProcessing(files, profile) {
  console.log("Using fallback processing without AI");

  const fallbackResults = files.map((file) => ({
    ...profile.fallbackTemplate,
    source: file.name,
  }));

  // Convert fallback results to CSV
  let fallbackCsvData;
  try {
    const csvOptions = {
      unwindArrays: true,
      expandArrayObjects: true,
      prependHeader: true,
      trimFieldValues: true,
      trimHeaderFields: true,
    };

    fallbackCsvData = converter.json2csv(fallbackResults, csvOptions);
  } catch (csvError) {
    console.error("Fallback CSV conversion failed:", csvError);
    fallbackCsvData = "Error converting to CSV: " + csvError.message;
  }

  return {
    json: fallbackResults,
    csv: fallbackCsvData,
    processingTime: "1.0s",
    totalFiles: files.length,
  };
}
