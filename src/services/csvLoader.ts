// src/services/csvLoader.ts
import Papa from 'papaparse';
import countries from 'world-countries'; 

// one row in your CSV
export interface RawSentimentRow {
  Country: string;
  Region: string;
  RandomValue: number;
}

// the Feature shape Deck.gl wants
export interface SentimentFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    country: string;
    region: string;
    sentiment: 'negative' | 'neutral' | 'positive';
    weight: number; // original RandomValue
  };
}

export async function loadSentimentCSV(): Promise<SentimentFeature[]> {
  // 1) build the absolute URL for your CSV
  const url = new URL(
    'geo_sentiments.csv',
    window.location.origin + import.meta.env.BASE_URL
  ).toString();
  console.log('▶️ fetching CSV from:', url);

  // 2) fetch & read
  const resp = await fetch(url, { cache: 'no-store' });
  if (!resp.ok) {
    throw new Error(`Failed to fetch CSV: ${resp.status}`);
  }
  const text = await resp.text();
  console.log('▶️ CSV header:', text.split('\n')[0]);

  // 3) parse with PapaParse
  const { data, errors } = Papa.parse<RawSentimentRow>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    delimiter: ',', 
  });
  if (errors.length) {
    console.warn('⚠️ CSV parse warnings:', errors);
  }

  // 4) map each row → Feature
  const features: SentimentFeature[] = data.map((row) => {
    // find the country object
    const countryObj = countries.find(
      (c) => c.name.common === row.Country.trim()
    );

    // extract [lng, lat] or fallback to [0,0]
    let coords: [number, number] = [0, 0];
    if (countryObj?.latlng?.length === 2) {
      const [lat, lng] = countryObj.latlng;
      coords = [lng, lat];
    }

    // map RandomValue → sentiment
    let sentiment: SentimentFeature['properties']['sentiment'] =
      row.RandomValue <= 0 ? 'negative' :
      row.RandomValue >= 2 ? 'positive' :
      'neutral';

    return {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: coords },
      properties: {
        country: row.Country,
        region: row.Region,
        sentiment,
        weight: row.RandomValue,
      },
    };
  });

  console.log(`✅ Loaded ${features.length} features`);
  return features;
}
