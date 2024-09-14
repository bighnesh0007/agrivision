import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEW_GOOGLE_API_KEY!);

export async function GET(request: NextRequest) {
    try {
        const crop = request.nextUrl.searchParams.get('crop');

        if (!crop) {
            return NextResponse.json({ error: "Crop parameter is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an agricultural expert AI. Provide detailed information about water consumption for the following crop: ${crop}. Include the following in your response:

Water Consumption:
- Provide average water requirements in liters per day or week.
- Include data for a bar chart showing water consumption across different growth stages.

Please format the water consumption data as a JSON array that can be easily parsed for chart creation. Each item in the array should have a 'growth_stage' and a 'water_consumption' value. For example:

[
  {"growth_stage": "Seedling", "water_consumption": 20},
  {"growth_stage": "Vegetative", "water_consumption": 50},
  {"growth_stage": "Flowering", "water_consumption": 80},
  {"growth_stage": "Fruiting", "water_consumption": 60}
]

Ensure the water consumption values are realistic for the crop.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract the JSON data from the response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const waterConsumptionData = JSON.parse(jsonMatch[0]);
            return NextResponse.json(waterConsumptionData);
        } else {
            throw new Error("Failed to extract water consumption data");
        }
    } catch (error) {
        console.error("Error generating water consumption data:", error);
        return NextResponse.json({ error: "Failed to generate water consumption data" }, { status: 500 });
    }
}