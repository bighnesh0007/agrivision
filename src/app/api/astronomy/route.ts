  import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.WEATHERAPI_API_KEY;
const API_URL = 'http://api.weatherapi.com/v1/astronomy.json';

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const date = searchParams.get('date');
   console.log(date)
  if (!city || !date) {
    return NextResponse.json({ error: 'Both city and date parameters are required' }, { status: 400 });
  }

  if (!API_KEY) {
    console.error('WEATHERAPI_API_KEY is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const url = `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&dt=${date}`;
    console.log('Fetching weather data from:', url.replace(API_KEY, 'API_KEY_HIDDEN'));

    const response = await fetch(url);
    const responseText = await response.text();

    // console.log('Raw API response:', responseText);

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
        details: responseText,
        parseError: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }, { status: 500 });
    }

    if (!data.location || !data.astronomy || !data.astronomy.astro) {
      console.error('Invalid API response structure:', data);
      return NextResponse.json({
        error: 'Invalid weather data structure',
        details: 'The API response does not contain the expected data fields',
        receivedData: data,
      }, { status: 500 });
    }
    
    const weatherData = {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        localtime: data.location.localtime,
        date:date
      },
      astronomy: {
        sunrise: data.astronomy.astro.sunrise,
        sunset: data.astronomy.astro.sunset,
        moonrise: data.astronomy.astro.moonrise,
        moonset: data.astronomy.astro.moonset,
        moon_phase: data.astronomy.astro.moon_phase,
        moon_illumination: data.astronomy.astro.moon_illumination,
        is_moon_up: data.astronomy.astro.is_moon_up,
        is_sun_up: data.astronomy.astro.is_sun_up,
      },
    };
    
    // Return the correctly formatted weather data
    return NextResponse.json(weatherData);
    

    

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Error in weather API route:', error);
    return NextResponse.json({ 
      error: 'Error fetching weather data', 
      details: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}