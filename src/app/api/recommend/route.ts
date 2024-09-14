import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {

  try {

    console.log(request)
    const { humidity,
      
      location,
    
      rainfall
      ,
      soilType,
      
      temperature,
      
      timeInHand,
       } = await request.json();
    
     
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `${humidity} ${location} ${rainfall} ${soilType} ${temperature} ${timeInHand} give details`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ recommendation: text });
  } catch (error) {
    console.error("Error generating crop recommendation:", error);
    return NextResponse.json({ error: "Failed to generate crop recommendation" }, { status: 500 });
  }
}