
import Papa from 'papaparse';

export interface RawSentimentRow {
  countryCode: string;
  latitude: string;   
  longitude: string;
  sentiment: string;  
}

export interface SentimentFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: {
    countryCode: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  };
}

export async function loadSentimentCSV(): Promise<SentimentFeature[]> {
  const response = await fetch('/geo_sentiments.csv');
  const csvText = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse<RawSentimentRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data, errors }) => {
        if (errors.length) return reject(errors);
        const features: SentimentFeature[] = data.map((row) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              parseFloat(row.longitude),
              parseFloat(row.latitude),
            ],
          },
          properties: {
            countryCode: row.countryCode,
            sentiment: row.sentiment as
              | 'positive'
              | 'neutral'
              | 'negative',
          },
        }));
        resolve(features);
      },
    });
  });
}
