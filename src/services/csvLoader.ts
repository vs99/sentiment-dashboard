// src/services/csvLoader.ts
import Papa from 'papaparse';

export interface RawSentimentRow {
  countryCode: string;
  latitude: number;    // thanks to dynamicTyping
  longitude: number;
  sentiment: string;
}

export interface SentimentFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    countryCode: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  };
}

export async function loadSentimentCSV(): Promise<SentimentFeature[]> {
  // Build the full URL, taking Vite's base path into account
  const url = new URL(
    'geo_sentiments.csv',
    window.location.origin + import.meta.env.BASE_URL
  ).toString();
  console.log('▶️ About to fetch CSV from:', url);

  // Fetch the CSV, bypassing any cache
  const response = await fetch(url, { cache: 'no-store' });
  console.log(
    '▶️ Fetch status:',
    response.status,
    'content-type:',
    response.headers.get('content-type')
  );

  // Read it as text and log the first chunk
  const text = await response.text();
  console.log('▶️ First 100 chars of response:', text.slice(0, 100));

  // Parse with PapaParse, forcing comma delimiter and dynamic typing
  const result = Papa.parse<RawSentimentRow>(text, {
    header: true,
    skipEmptyLines: true,
    delimiter: ',',
    dynamicTyping: true,
  });

  if (result.errors.length) {
    console.warn('⚠️ CSV parse warnings:', result.errors);
  }

  // Map rows into GeoJSON-style features
  const features: SentimentFeature[] = result.data.map((row) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [row.longitude, row.latitude],
    },
    properties: {
      countryCode: row.countryCode,
      sentiment: row.sentiment as 'positive' | 'neutral' | 'negative',
    },
  }));

  return features;
}
