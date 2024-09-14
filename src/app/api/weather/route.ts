import { NextResponse } from 'next/server';

const API_KEY = process.env.WEATHERAPI_API_KEY;
const API_URL = 'http://api.weatherapi.com/v1/forecast.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json({ error: 'City parameter is required' }, { status: 400 });
  }

  if (!API_KEY) {
    console.error('WEATHERAPI_API_KEY is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const url = `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&days=3&aqi=yes&alerts=no`;
    console.log('Fetching weather data from:', url.replace(API_KEY, 'API_KEY_HIDDEN'));

    const response = await fetch(url);
    const responseText = await response.text();

    // console.log('Raw API response:', responseText); // Uncomment to see raw API response

    if (!response.ok) {
      console.error('API response error:', response.status, responseText);
      return NextResponse.json({ 
        error: `Failed to fetch weather data: ${response.status}`,
        details: responseText
      }, { status: response.status });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json({ 
        error: 'Error parsing weather data',
        details: responseText
      }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in weather API route:', error);
    return NextResponse.json({ 
      error: 'Error fetching weather data', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}