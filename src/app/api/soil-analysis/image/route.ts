import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const image = data.get("image") as File;

  if (!image) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Analyze this soil sample image and provide a detailed soil quality analysis. Include information on soil type, pH levels, nutrient content (N, P, K), organic matter content, and any visible issues or deficiencies. Also, suggest suitable crops for this soil and any recommendations for improving soil quality.";
    const imageParts = [
      {
        inlineData: {
          data: Buffer.from(await image.arrayBuffer()).toString("base64"),
          mimeType: image.type,
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Error analyzing soil quality:", error);
    return NextResponse.json({ error: "Failed to analyze soil quality" }, { status: 500 });
  }
}