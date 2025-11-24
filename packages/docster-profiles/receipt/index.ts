import type { IProfile } from "../types/profile";
import { z } from "zod";
import { RECEIPT_STRINGS } from "./strings";

export class Receipt implements IProfile {
    public profileName = RECEIPT_STRINGS.profileName;
    public acceptedFileTypes = RECEIPT_STRINGS.acceptedFileTypes;
    public providers = RECEIPT_STRINGS.providers;

    public prompt = RECEIPT_STRINGS.prompt;
    public requiredKeys = RECEIPT_STRINGS.requiredKeys;

    public schema = z.array(
        z.object({
            // ---- Store Info ----
            storeName: z.string().optional(),
            storeAddress: z.string().optional(),
            taxOffice: z.string().optional(),   // V.D.
            vkn: z.string().optional(),         // Vergi No

            // ---- Receipt Meta ----
            date: z.string().optional(),
            time: z.string().optional(),

            receiptNumber: z.string().optional(),   // Fiş No


            bankName: z.string().optional(),
            cardNumber: z.string().optional(),      // ****4589

            // ---- Items ----
            items: z
                .array(
                    z.object({
                        itemName: z.string().optional(),
                        quantity: z.number().optional().default(1),
                        unitPrice: z.number().optional().default(0),
                        totalPrice: z.number().optional().default(0),
                        currency: z.string().optional().default("TRY"),
                        taxRate: z.string().optional(),     // "%8"
                        taxAmount: z.number().optional(),   // numeric
                        barcode: z.string().optional(),     // ALWAYS string
                    })
                )
                .optional(),

            // ---- Tax Summary ----
            taxSummary: z
                .array(
                    z.object({
                        rate: z.string().optional(),
                        baseAmount: z.number().optional(),
                        taxAmount: z.number().optional(),
                    })
                )
                .optional(),

            totalTax: z.number().optional(),

            // ---- Totals ----
            subtotal: z.number().optional(),
            total: z.number().optional(),
            currency: z.string().optional().default("TRY"),
            change: z.number().optional(),

            // ---- Payment ----
            paymentMethod: z.string().optional(),
            cashier: z.string().optional(),
        })
    );

    public csvConversionOptions = {
        unwindArrays: true,
        unwindPaths: ["items", "taxSummary"],
        expandArrayObjects: true,
        prependHeader: true,
        trimFieldValues: true,
        trimHeaderFields: true,
    };

    public fallbackTemplate = {
        storeName: "",
        storeAddress: "",
        taxOffice: "",
        vkn: "",
        receiptNumber: "",
        bankName: "",
        cardNumber: "",
        date: "",
        time: "",
        items: [],
        taxSummary: [],
        totalTax: 0,
        subtotal: 0,
        total: 0,
        currency: "TRY",
        change: 0,
        paymentMethod: "",
        cashier: "",
    };
}

export default Receipt;
