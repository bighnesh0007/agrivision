import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      cropType,
      region,
      soilType,
      season,
      sowingDate,
      expectedHarvestDate,
    } = body;

    if (!cropType || !region || !soilType || !season || !sowingDate || !expectedHarvestDate) {
      return NextResponse.json({ error: 'Please fill out all required fields.' }, { status: 400 });
    }

    const prompt = `
      Generate a detailed crop roadmap based on the following information:
      ${JSON.stringify(body, null, 2)}

      Please provide a comprehensive roadmap including:
      1. Pre-planting preparations
      2. Planting process
      3. Growth stages and care instructions
      4. Pest and disease management
      5. Irrigation and fertilization schedule
      6. Harvest preparation and timing
      7. Post-harvest handling and storage

      Format the roadmap in HTML for easy display.
    `;

    const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);

    if (!result) {
      throw new Error('Failed to generate roadmap content.');
    }

    const roadmap = result;

    return NextResponse.json({ result: roadmap });
  } catch (error : any) {
    console.error('Error generating roadmap:', error.message || error);
    return NextResponse.json({ error: 'Failed to generate roadmap. Please try again later.' }, { status: 500 });
  }
}
