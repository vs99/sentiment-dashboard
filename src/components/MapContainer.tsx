// src/components/MapContainer.tsx
import React, { useState, useEffect } from "react";
import DeckGL, { ViewState } from "@deck.gl/react";
import { StaticMap } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { useSentimentContext } from "../context/SentimentContext";
import { getHeatmapLayer } from "./HeatmapLayer";
import RegionModal from "./RegionModal";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

export default function MapContainer() {
  const { state, dispatch } = useSentimentContext();
  const { features, filter, selectedCountry } = state;

  // world view
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 0,
    latitude: 20,
    zoom: 1,
    pitch: 0,
    bearing: 0,
  });

  // when user selects a country, center & zoom in
  useEffect(() => {
    if (selectedCountry) {
      const pts = features.filter(
        (f) => f.properties.countryCode === selectedCountry
      );
      if (pts.length) {
        const lats = pts.map((f) => f.geometry.coordinates[1]);
        const lngs = pts.map((f) => f.geometry.coordinates[0]);
        const latitude = lats.reduce((a, b) => a + b, 0) / lats.length;
        const longitude = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        setViewState((v) => ({ ...v, latitude, longitude, zoom: 4 }));
      }
    } else {
      setViewState((v) => ({ ...v, latitude: 20, longitude: 0, zoom: 1 }));
    }
  }, [selectedCountry, features]);

  const layers = [getHeatmapLayer({ data: features, filter })];

  return (
    <>
      <DeckGL
        viewState={viewState}
        controller={true}
        layers={layers}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        onClick={(info) => {
          if (info.layer?.id === "sentiment-heatmap" && info.object) {
            const code = info.object.properties.countryCode;
            dispatch({ type: "SELECT_COUNTRY", payload: code });
          }
        }}
      >
        <StaticMap mapLib={maplibregl} mapStyle={MAP_STYLE} />
      </DeckGL>
      <RegionModal />
    </>
  );
}
