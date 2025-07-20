import { data } from "@remix-run/node";
import { Proposal as ProposalProfile } from "docster-profiles";

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

    // Process files (mock implementation)
    const processedFiles = [];

    for (const file of files) {
      if (file instanceof File) {
        // Sample code to handle file (in real implementation you'd process the PDF)
        console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);

        // You could read file content here if needed:
        // const arrayBuffer = await file.arrayBuffer();
        // const buffer = Buffer.from(arrayBuffer);

        processedFiles.push({
          filename: file.name,
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified).toISOString(),
        });
      }
    }

    // Generate mock data based on uploaded files
    const mockJsonData = {
      documents: processedFiles.map((file, index) => ({
        id: index + 1,
        filename: file.filename,
        title: file.filename.replace(/\.[^/.]+$/, ""), // Remove extension
        content: `This is the extracted content from ${file.filename}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        metadata: {
          originalFilename: file.filename,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          pages: Math.floor(Math.random() * 20) + 1,
          words: Math.floor(Math.random() * 5000) + 500,
          characters: Math.floor(Math.random() * 25000) + 2500,
          created: new Date().toISOString().split("T")[0],
          processed: new Date().toISOString(),
          language: "en",
          encoding: "UTF-8",
        },
        extractedData: {
          headings: [
            `Introduction to ${file.filename.replace(/\.[^/.]+$/, "")}`,
            "Key Findings",
            "Analysis",
            "Conclusions",
          ],
          tables: Math.floor(Math.random() * 5),
          images: Math.floor(Math.random() * 10),
          links: Math.floor(Math.random() * 15),
        },
      })),
      summary: {
        totalFiles: processedFiles.length,
        totalPages: processedFiles.reduce(
          (sum, file, index) => sum + Math.floor(Math.random() * 20) + 1,
          0
        ),
        totalSize: processedFiles.reduce((sum, file) => sum + file.size, 0),
        processedAt: new Date().toISOString(),
        processingTime: `${Math.floor(Math.random() * 30) + 5}s`,
      },
    };

    // Generate CSV data (flattened version for CSV format)
    const mockCsvData = processedFiles.map((file, index) => ({
      id: index + 1,
      filename: file.filename,
      title: file.filename.replace(/\.[^/.]+$/, ""),
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      pages: Math.floor(Math.random() * 20) + 1,
      words: Math.floor(Math.random() * 5000) + 500,
      characters: Math.floor(Math.random() * 25000) + 2500,
      tables: Math.floor(Math.random() * 5),
      images: Math.floor(Math.random() * 10),
      links: Math.floor(Math.random() * 15),
      language: "en",
      processed: new Date().toISOString().split("T")[0],
      status: "completed",
    }));

    // Return both formats
    const responseData = {
      json: mockJsonData,
      csv: mockCsvData,
    };

    return data({
      success: true,
      data: responseData,
      message: `Successfully processed ${processedFiles.length} file(s)`,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return data(
      { success: false, error: "Failed to process files" },
      { status: 500 }
    );
  }
}
