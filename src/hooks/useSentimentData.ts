// src/hooks/useSentimentData.ts
import { useState, useEffect } from 'react';
import { loadSentimentCSV, type SentimentFeature } from '../services/csvLoader';

export function useSentimentData() {
  const [data, setData] = useState<SentimentFeature[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadSentimentCSV()
      .then((features) => {
        setData(features);
      })
      .catch((err) => {
        console.error('Error loading sentiments:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
