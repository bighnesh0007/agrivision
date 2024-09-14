import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.WEATHERAPI_API_KEY;
const API_URL = 'http://api.weatherapi.com/v1/future.json';

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

    console.log('Raw API response:', responseText);

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

    if (!data.location || !data.forecast || !data.forecast.forecastday || data.forecast.forecastday.length === 0) {
      console.error('Invalid API response structure:', data);
      return NextResponse.json({ 
        error: 'Invalid weather data structure',
        details: 'The API response does not contain the expected data fields',
        receivedData: data
      }, { status: 500 });
    }

    const weatherData = {
      location: {
        name: data.location.name,
        country: data.location.country,
        localtime: data.location.localtime,
      },
      forecast: {
        forecastday: [{
          date: data.forecast.forecastday[0].date,
          day: {
            maxtemp_c: data.forecast.forecastday[0].day.maxtemp_c,
            mintemp_c: data.forecast.forecastday[0].day.mintemp_c,
            avgtemp_c: data.forecast.forecastday[0].day.avgtemp_c,
            maxwind_kph: data.forecast.forecastday[0].day.maxwind_kph,
            totalprecip_mm: data.forecast.forecastday[0].day.totalprecip_mm,
            avghumidity: data.forecast.forecastday[0].day.avghumidity,
            condition: {
              text: data.forecast.forecastday[0].day.condition.text,
              icon: data.forecast.forecastday[0].day.condition.icon,
            },
            uv: data.forecast.forecastday[0].day.uv,
          },
          astro: {
            sunrise: data.forecast.forecastday[0].astro.sunrise,
            sunset: data.forecast.forecastday[0].astro.sunset,
            moon_phase: data.forecast.forecastday[0].astro.moon_phase,
          },
        }],
      },
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Error in weather API route:', error);
    return NextResponse.json({ 
      error: 'Error fetching weather data', 
      details: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}