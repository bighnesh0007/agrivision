import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const api = "AIzaSyAEBoSRb0rFhZGiaEyhv-14Ti5hR7xmr4Q";

if (!api) {
  throw new Error("Google API key is missing. Set it in your environment variables.");
}

const genAI = new GoogleGenerativeAI(api);

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const image = data.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Identify this plant and provide its name and some important information about it. 100 words or less.";
    const imageParts = [
      {
        inlineData: {
          data: Buffer.from(await image.arrayBuffer()).toString("base64"),
          mimeType: image.type,
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const text = result.response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Error identifying plant:", error);
    return NextResponse.json({ error: "Failed to identify plant" }, { status: 500 });
  }
}
