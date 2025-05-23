// src/components/HeatmapLayer.tsx
import { HeatmapLayer as DeckHeatmapLayer } from "@deck.gl/aggregation-layers";
import type { SentimentFeature } from "../services/csvLoader";

export interface HeatmapLayerProps {
  data: SentimentFeature[];
  filter: "all" | "positive" | "neutral" | "negative";
}

/**
 * Returns a Deck.gl HeatmapLayer instance,
 * automatically filtering by sentiment if needed.
 */
export function getHeatmapLayer({ data, filter }: HeatmapLayerProps) {
  const filtered =
    filter === "all"
      ? data
      : data.filter((f) => f.properties.sentiment === filter);

  return new DeckHeatmapLayer({
    id: "sentiment-heatmap",
    data: filtered,
    getPosition: (d: SentimentFeature) => d.geometry.coordinates,
    getWeight: (_: SentimentFeature) => 1,
    radiusPixels: 40,
    intensity: 1,
    threshold: 0.05,
  });
}
