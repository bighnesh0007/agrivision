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

    const prompt = "Analyze the provided Potato leaf image to identify any signs of disease. If a disease is detected, provide a detailed analysis including the name of the disease, the symptoms observed on the leaf, and the likely pathogen responsible. When describing the symptoms and pathogens, include their names in Hindi within brackets for the detected symptom and pathogen. Explain the current stage of the disease and its potential impact on crop yield if left untreated. Recommend effective treatment options, categorized into chemical, biological, and cultural practices, and explain how each treatment works to combat the disease. Additionally, outline preventative measures to avoid future outbreaks, detailing how each recommended treatment or practice can be used to prevent the recurrence of the disease. Finally, offer further advice for managing and monitoring the disease in Potato crops, ensuring long-term plant health and yield optimization. If the uploaded image does not belong to the Potato crop, display a message stating (Crop category mismatch. Please upload an image of a Potato Leaf for Analysis)";
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
    console.error("Error detecting potato disease:", error);
    return NextResponse.json({ error: "Failed to detect potato disease" }, { status: 500 });
  }
}