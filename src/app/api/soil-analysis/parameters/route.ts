import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  const { nitrogen, phosphorus, potassium } = await request.json();

  if (!nitrogen || !phosphorus || !potassium) {
    return NextResponse.json({ error: "Missing NPK values" }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze soil quality based on the following NPK values:
    Nitrogen: ${nitrogen} ppm
    Phosphorus: ${phosphorus} ppm
    Potassium: ${potassium} ppm

    Provide a detailed soil quality analysis including:
    1. Interpretation of these NPK levels
    2. Soil fertility assessment
    3. Potential nutrient deficiencies or excesses
    4. Suitable crops for this soil composition
    5. Recommendations for improving soil quality
    6. Any potential environmental concerns based on these levels`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Error analyzing soil quality:", error);
    return NextResponse.json({ error: "Failed to analyze soil quality" }, { status: 500 });
  }
}