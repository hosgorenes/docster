import { data } from "@remix-run/node";
import {
  processDocumentsWithAI,
  fallbackProcessing,
} from "../lib/googleai.server.js";
import {
  Proposal as ProposalProfile,
  HVAC as HVACProfile,
} from "docster-profiles";

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return data(
        { success: false, error: "No files uploaded" },
        { status: 400 }
      );
    }

    // Instantiate selected Profile
    const profile = new HVACProfile();

    // Validate files
    for (const file of files) {
      if (!(file instanceof File)) {
        return data(
          { success: false, error: "Invalid file format" },
          { status: 400 }
        );
      }

      // Check file type against accepted types in ProposalProfile
      if (!profile.acceptedFileTypes.includes(file.type)) {
        return data(
          {
            success: false,
            error: `File ${file.name} type ${
              file.type
            } is not supported. Accepted types: ${profile.acceptedFileTypes.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }

      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return data(
          {
            success: false,
            error: `File ${file.name} is too large. Maximum file size is 10MB.`,
          },
          { status: 400 }
        );
      }

      // Check if file is empty
      if (file.size === 0) {
        return data(
          {
            success: false,
            error: `File ${file.name} is empty.`,
          },
          { status: 400 }
        );
      }
    }

    console.log(
      `Processing ${files.length} files with Google AI using ${profile.profileName} profile`
    );

    // Process files with Google AI and ProposalProfile
    let processedData;
    try {
      processedData = await processDocumentsWithAI(files, profile);
    } catch (aiError) {
      console.error("Google AI processing failed:", aiError);

      // Fallback to basic processing if AI fails
      console.log("Falling back to basic processing...");
      processedData = await fallbackProcessing(files);
    }

    // Return the structured data according to ProposalProfile schema
    const responseData = {
      json: processedData.json,
      csv: processedData.csv,
    };

    return data({
      success: true,
      data: responseData,
      message: `Successfully processed ${files.length} file(s) using ${profile.profileName} profile`,
      profileUsed: profile.profileName,
      processingTime: processedData.processingTime,
      totalFiles: processedData.totalFiles,
    });
  } catch (error) {
    console.error("File upload error:", error);

    // Check if it's a Google AI API key error
    if (error.message.includes("GOOGLE_AI_API_KEY")) {
      return data(
        {
          success: false,
          error:
            "Google AI service is not configured. Please check API key configuration.",
        },
        { status: 500 }
      );
    }

    return data(
      { success: false, error: "Failed to process files: " + error.message },
      { status: 500 }
    );
  }
}
