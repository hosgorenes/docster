export const RECEIPT_STRINGS = {
   profileName: "Receipt",

   acceptedFileTypes: [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/pjpeg",
      "image/x-png",
   ],

   providers: ["GoogleAI"],

   requiredKeys: [
      "storeName",
      "storeAddress",
      "date",
      "time",
      "items",
      "total",
      "paymentMethod",
   ],

   prompt: `
You are given Turkish cash register receipts ("kasa fişi").
Extract ONLY the information that is explicitly printed on the receipt.
Do NOT guess, infer, assume, or generate missing data.

⚠️ IMPORTANT RULES
- All prices MUST be numbers, no currency symbols.
- Convert comma decimals to dot decimals (e.g., 19,95 → 19.95).
- Convert dates from DD.MM.YYYY → YYYY-MM-DD.
- Preserve all item names exactly as printed.
- Masked card numbers must be returned as printed (e.g., ****4589).
- If a field is missing, return null or empty string — NEVER guess.

----------------------------------------------
FIELDS TO EXTRACT (Only if printed)
----------------------------------------------

1) storeName  
- Printed store/business name.

2) storeAddress  
- Full printed address.  
- No guessing; return partial address if partial printed.

3) taxOffice (Vergi Dairesi / V.D.)  
4) vkn (Vergi Kimlik Numarası)  

5) receiptNumber (Fiş No / Belge No / Slip No)

6) bankName (Ziraat, İş Bankası, Yapı Kredi, etc.)
7) cardNumber (**** masked card)

8) date  
9) time  

10) items[]  
Each item should include:
- itemName
- quantity (default: 1 if not printed)
- unitPrice
- totalPrice
- currency (default: TRY)
- taxRate (%1, %8, %20)
- taxAmount
- barcode (if printed)

11) taxSummary[]  
Each entry:
- rate
- baseAmount
- taxAmount

12) totalTax  
13) subtotal  
14) total  
15) currency (default TRY)

16) paymentMethod  
Accepted: cash, credit card, bank card, debit card

17) change  
18) cashier  

----------------------------------------------
RETURN FORMAT
----------------------------------------------

Return a SINGLE OBJECT inside an array:
[
  {
    ...receiptData
  }
]

Never return multiple receipts from one image.

----------------------------------------------
DO NOT:
- Do not invent fields.
- Do not guess missing numbers.
- Do not translate item names.
- Do not output explanations. Only valid JSON.
   `,
};
