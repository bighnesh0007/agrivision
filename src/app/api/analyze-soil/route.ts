import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEW_GOOGLE_API_KEY as string)

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Decode base64 image
    const buffer = Buffer.from(image.split(',')[1], 'base64')

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent([
      `You are an expert soil scientist with over 15 years of experience in analyzing soil samples and images. Your expertise lies in identifying soil types, textures, and colors, as well as recommending suitable crops based on the soil characteristics you observe.

Your task is to analyze an image of soil that will be provided to you and provide a detailed description. Here are the specifics regarding the image you will analyze:

- Soil Image: 
- Location: 
- Climate Type: 
- Any Known Soil Amendments: 

As you analyze the image, please keep the following in mind: consider the visual cues in the image to determine key soil characteristics such as its texture (sandy, loamy, clayey, etc.), color (base colors, variations), and any observable features. Based on this analysis, provide recommendations for potential crops that could thrive in this soil.

If applicable, you may also include how soil health can be enhanced for better crop yields based on the observed characteristics.`,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: buffer.toString('base64')
        }
      }
    ])

    const response = await result.response
    const analysis = response.text()

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error analyzing soil:', error)
    return NextResponse.json({ error: 'Error analyzing soil' }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb' // Set the body parser limit to 4MB
    }
  }
}