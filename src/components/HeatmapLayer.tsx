// src/components/HeatmapLayer.tsx
import { HeatmapLayer as DeckHeatmapLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer } from "@deck.gl/layers";
import type { SentimentFeature } from "../services/csvLoader";

export interface HeatmapLayerProps {
  data: SentimentFeature[];
  filter: "all" | "positive" | "neutral" | "negative";
}

/**
 * Returns an array of Deck.gl layers:
 * 1) A HeatmapLayer for the color‐coded density
 * 2) A transparent ScatterplotLayer for picking/hovering individual points
 */
export function getLayers({ data, filter }: HeatmapLayerProps) {
  // apply your filter
  const filtered =
    filter === "all"
      ? data
      : data.filter((f) => f.properties.sentiment === filter);

  // 1) the heatmap
  const heatmap = new DeckHeatmapLayer({
    id: "sentiment-heatmap",
    data: filtered,
    pickable: false,
    getPosition: (d: SentimentFeature) => d.geometry.coordinates,
    getWeight: () => 1,
    radiusPixels: 40,
    intensity: 1,
    threshold: 0.05,
  });

  // 2) invisible scatter layer for picking
  const pickLayer = new ScatterplotLayer({
    id: "sentiment-pick-layer",
    data: filtered,
    pickable: true, // enable hover/click events
    stroked: false,
    filled: true,
    opacity: 0, // fully transparent
    radiusPixels: 20, // hit‐area radius
    getPosition: (d: SentimentFeature) => d.geometry.coordinates,
  });

  return [heatmap, pickLayer];
}
