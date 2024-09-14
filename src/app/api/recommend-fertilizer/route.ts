import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { temperature, humidity, moisture, soilType, cropType, nitrogen, phosphorous } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Based on the following information, recommend suitable fertilizers:
    Temperature: ${temperature}°C
    Humidity: ${humidity}%
    Moisture: ${moisture}%
    Soil Type: ${soilType}
    Crop Type: ${cropType}
    Nitrogen: ${nitrogen} kg/ha
    Phosphorous: ${phosphorous} kg/ha

    Please provide a list of 2-3 recommended fertilizers, along with application rates and a brief explanation for each recommendation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ recommendation: text });
  } catch (error) {
    console.error("Error generating fertilizer recommendation:", error);
    return NextResponse.json({ error: "Failed to generate fertilizer recommendation" }, { status: 500 });
  }
}