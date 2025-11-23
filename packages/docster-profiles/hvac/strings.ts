export const HVAC_STRINGS = {
    profileName: "HVAC",

    acceptedFileTypes: ["application/pdf"],
    providers: ["GoogleAI"],

    requiredKeys: [
        "supplyAirFlow",
        "returnAirFlow",
        "supplyStaticPD",
        "returnStaticPD",
    ],

    prompt: `
  You are provided with documents containing HVAC (Heating, Ventilating, and Air Conditioning) specifications.
  
  Your task is to extract structured technical data about Air Handling Units (AHUs).
  
  Always return valid JSON.
  
  Extract the following:
  - Supply Air Flow
  - Return Air Flow
  - SupplyStaticPD
  - ReturnStaticPD
  
  For each extracted AHU group, include:
  - projectName
  - ahuName (air system name)
  - value
  - unit
  - confidence (0 to 1)
  
  Respect original language, do not translate labels or text.
  
  Use common HVAC field name variations such as:
  - "Hava debisi", "Üfleme debisi", "Return flow rate"
  - "Static pressure drop", "Kanal basıncı", "Cihaz Dışı Statik Basınç"
  
  Units accepted:
  - Air Flow: m³/h, m³/s, L/s
  - Static Pressure: Pa
  `,
};
