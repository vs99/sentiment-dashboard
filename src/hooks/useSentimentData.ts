// src/hooks/useSentimentData.ts
import { useState, useEffect } from 'react';
import { loadSentimentCSV, type SentimentFeature } from '../services/csvLoader';

export function useSentimentData() {
  const [data, setData] = useState<SentimentFeature[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('▶️ useSentimentData: fetching CSV…');
    loadSentimentCSV()
      .then((features) => {
        console.log(`✅ useSentimentData: parsed ${features.length} features`, features.slice(0,3));
        setData(features);
      })
      .catch((err) => {
        console.error('❌ useSentimentData: error loading CSV', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setLoading(false);
        console.log('ℹ️ useSentimentData: loading complete');
      });
  }, []);

  return { data, loading, error };
}
