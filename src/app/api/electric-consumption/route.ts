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

      const prompt = `You are an agricultural expert AI. Provide detailed information about electric consumption for ${crop} cultivation. Include the following in your response:

Electric Consumption:
- Estimate the electric consumption for various farming operations related to ${crop}.
- Provide data for a pie chart showing the distribution of electricity usage.

Format the electric consumption data as a JSON array that can be easily parsed for chart creation. Each item in the array should have a 'name' for the operation and a 'percentage' for its share of total electricity usage. For example:

[
  {"name": "Irrigation", "percentage": 40},
  {"name": "Climate Control", "percentage": 30},
  {"name": "Lighting", "percentage": 20},
  {"name": "Other", "percentage": 10}
]

Ensure the percentages add up to 100.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract the JSON data from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
         const electricConsumptionData = JSON.parse(jsonMatch[0]);
         return NextResponse.json(electricConsumptionData);
      } else {
         throw new Error("Failed to extract electric consumption data");
      }
   } catch (error) {
      console.error("Error generating electric consumption data:", error);
      return NextResponse.json({ error: "Failed to generate electric consumption data" }, { status: 500 });
   }
}