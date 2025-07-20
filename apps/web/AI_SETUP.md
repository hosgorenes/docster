# Google AI Integration with ProposalProfile Setup

This document explains how to set up and use Google AI with LangChain for processing PDF documents using the ProposalProfile schema in the Docster application.

## Overview

The application integrates Google AI (Gemini) with LangChain to:
- Process PDF files as base64 encoded content
- Use ProposalProfile schema for structured output
- Extract proposal and agreement information
- Return validated JSON and CSV data

## Prerequisites

1. **Google AI API Key**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Environment Setup**: Configure your environment variables
3. **ProposalProfile Package**: Already imported from `docster-profiles`

## Installation

The following dependencies are installed:

```bash
bun add @langchain/google-genai @langchain/core zod langchain
```

## Environment Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Add your Google AI API key to `.env`:
```env
GOOGLE_AI_API_KEY=your_actual_google_ai_api_key_here
```

## ProposalProfile Structure

The `Proposal` class from `docster-profiles` package contains:

```typescript
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
    If each product has a special condition include that in a separate property. if not set it to null.
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
```

## How It Works

### 1. File Upload & Validation
- Files are validated against `ProposalProfile.acceptedFileTypes` (PDF only)
- File size limit: 10MB
- Empty files are rejected

### 2. AI Processing Pipeline
```javascript
// Convert file to base64
const base64Content = fileToBase64(buffer);

// Create structured output model
const structuredModel = model.withStructuredOutput(proposalProfile.schema, {
  name: "proposal_extraction",
});

// Process with base64 content
const result = await structuredModel.invoke([
  {
    role: "user",
    content: [
      { type: "text", text: proposalProfile.prompt },
      { type: "media", mimeType: file.type, data: base64Content }
    ],
  },
]);
```

### 3. Structured Output
- Uses LangChain's `withStructuredOutput()` method
- Enforces ProposalProfile's Zod schema
- Returns validated JSON matching the schema

### 4. Data Transformation
- JSON: Array of proposal objects with nested products
- CSV: Flattened format suitable for spreadsheets
- Schema validation ensures data consistency

## Expected Output Format

### JSON Structure
```json
[
  {
    "vendorName": "Example Corp",
    "agreementName": "Software License Agreement",
    "proposalValues": 50000,
    "proposalCurrency": "USD",
    "products": [
      {
        "productName": "Enterprise License",
        "productProposalValue": "30000",
        "productRemarks": "Annual subscription"
      },
      {
        "productName": "Support Package",
        "productProposalValue": "20000",
        "productRemarks": "24/7 support included"
      }
    ]
  }
]
```

### CSV Structure
```csv
proposalIndex,vendorName,agreementName,proposalValues,proposalCurrency,productName,productProposalValue,productRemarks
1,Example Corp,Software License Agreement,50000,USD,Enterprise License,30000,Annual subscription
1,Example Corp,Software License Agreement,50000,USD,Support Package,20000,24/7 support included
```

## Key Features

### Base64 PDF Processing
- No text extraction required
- Sends entire PDF as base64 to Gemini
- Leverages Gemini's native PDF understanding

### Schema Validation
- Uses ProposalProfile's Zod schema
- Ensures output matches expected structure
- Validates data types and required fields

### Error Handling
- Graceful fallback if AI processing fails
- File validation before processing
- Schema validation errors logged but don't break flow

## API Response Format

### Success Response
```javascript
{
  success: true,
  data: {
    json: [ /* array of proposal objects */ ],
    csv: [ /* array of flattened CSV objects */ ]
  },
  message: "Successfully processed 2 file(s) using Isbank profile",
  profileUsed: "Isbank",
  processingTime: "3.2s",
  totalFiles: 2
}
```

### Error Response
```javascript
{
  success: false,
  error: "Error description"
}
```

## Configuration Options

### Model Settings
```javascript
const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-pro",
  temperature: 0.3,
  maxOutputTokens: 4000,
  apiKey: process.env.GOOGLE_AI_API_KEY,
});
```

### Structured Output
```javascript
const structuredModel = model.withStructuredOutput(proposalProfile.schema, {
  name: "proposal_extraction",
});
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify key is correct in `.env` file
   - Check Google AI Studio quotas
   - Ensure billing is enabled

2. **File Processing Errors**
   - Only PDF files are accepted
   - Maximum file size: 10MB
   - Files must not be password protected

3. **Schema Validation Errors**
   - AI output doesn't match expected schema
   - Missing required fields
   - Incorrect data types

4. **Base64 Encoding Issues**
   - Large files may hit token limits
   - Corrupted files fail to encode

### Solutions

1. **Check Environment Variables**
```bash
echo $GOOGLE_AI_API_KEY
```

2. **Test API Connection**
Use Google AI Studio to test your API key.

3. **Monitor Logs**
```bash
npm run dev
# Check console for processing logs
```

4. **Fallback Processing**
If AI fails, the system automatically falls back to basic processing.

## Security Considerations

1. **API Key Protection**
   - Never commit API keys to version control
   - Use environment variables only
   - Rotate keys regularly

2. **File Processing**
   - Validate file types and sizes
   - 10MB file size limit
   - PDF-only restriction

3. **Data Privacy**
   - PDF content is sent to Google AI
   - Consider data sensitivity
   - Review Google AI's privacy policy

## Performance Considerations

### Processing Time
- AI analysis: 2-5 seconds per document
- Base64 encoding: Minimal overhead
- Schema validation: Minimal overhead

### Memory Usage
- Files loaded into memory for base64 conversion
- 10MB limit prevents memory issues
- Files released after processing

### Token Usage
- Base64 PDFs use more tokens than text
- Large files may approach token limits
- Monitor usage in Google AI Studio

## Next Steps

1. **Custom Profiles**: Create additional profiles for different document types
2. **Batch Processing**: Implement parallel processing for multiple files
3. **Caching**: Cache results for identical files
4. **Enhanced Validation**: Add more sophisticated schema validation
5. **Progress Tracking**: Add real-time processing progress
6. **Export Options**: Add more export formats beyond JSON/CSV

## Support

For issues related to:
- **Google AI**: Check [Google AI documentation](https://ai.google.dev/docs)
- **LangChain**: See [LangChain documentation](https://docs.langchain.com/)
- **ProposalProfile**: Review the `docster-profiles` package
- **Zod Validation**: Check [Zod documentation](https://zod.dev/)