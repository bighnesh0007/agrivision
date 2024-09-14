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

    const prompt = "Analyze this crop image and generate a detailed roadmap for growing this crop. Include information about soil preparation, planting, care instructions, pest management, and harvesting. Format the roadmap in inside the body tag part only for easy display(dont add body tag).";
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
    return NextResponse.json({ error: "Failed to analyze soil quality from route" }, { status: 500 });
  }
}