// src/components/MapContainer.tsx
import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl/maplibre";
import { useSentimentContext } from "../context/SentimentContext";
import { getHeatmapLayer } from "./HeatmapLayer";

type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

export default function MapContainer() {
  const { state, dispatch } = useSentimentContext();
  const { features, filter, selectedCountry } = state;

  const [viewState, setViewState] = useState<ViewState>({
    longitude: 0,
    latitude: 20,
    zoom: 1,
    pitch: 0,
    bearing: 0,
  });

  // recenter when the selectedCountry (string) changes
  useEffect(() => {
    if (selectedCountry) {
      const pts = features.filter(
        (f) => f.properties.country === selectedCountry
      );
      if (pts.length) {
        const lats = pts.map((f) => f.geometry.coordinates[1]);
        const lngs = pts.map((f) => f.geometry.coordinates[0]);
        const latitude = lats.reduce((a, b) => a + b, 0) / lats.length;
        const longitude = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        setViewState((v) => ({
          ...v,
          latitude,
          longitude,
          zoom: 4,
        }));
      }
    } else {
      setViewState((v) => ({ ...v, latitude: 20, longitude: 0, zoom: 1 }));
    }
  }, [selectedCountry, features]);

  return (
    <DeckGL
      viewState={viewState}
      controller
      layers={[getHeatmapLayer({ data: features, filter })]}
      onViewStateChange={({ viewState }) =>
        setViewState(viewState as ViewState)
      }
      onClick={(info) => {
        if (info.layer?.id === "sentiment-heatmap" && info.object) {
          // dispatch by f.properties.country
          dispatch({
            type: "SELECT_COUNTRY",
            payload: info.object.properties.country,
          });
        }
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <Map mapStyle={MAP_STYLE} reuseMaps />
    </DeckGL>
  );
}
