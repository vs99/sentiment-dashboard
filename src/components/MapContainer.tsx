// src/components/MapContainer.tsx
import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl/maplibre";
import { FlyToInterpolator } from "@deck.gl/core";
import { Box, VStack, Text } from "@chakra-ui/react";
import { useSentimentContext } from "../context/SentimentContext";
import { getLayers } from "./HeatmapLayer";

const MAP_STYLE = "https://demotiles.maplibre.org/style.json";

export default function MapContainer() {
  const { state, dispatch } = useSentimentContext();
  const { features, filter, selectedCountry } = state;

  // allow transition props on the viewState
  const [viewState, setViewState] = useState<any>({
    longitude: 0,
    latitude: 20,
    zoom: 1,
    pitch: 0,
    bearing: 0,
  });

  // hover info: holds screen coords + sentiment counts
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    counts: { positive: number; neutral: number; negative: number };
  } | null>(null);

  // when a country is selected, fly the camera there
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

        setViewState({
          ...viewState,
          latitude,
          longitude,
          zoom: 4,
          transitionDuration: 800,
          transitionInterpolator: new FlyToInterpolator(),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  return (
    <Box position="absolute" top={0} right={0} bottom={0} left={0}>
      <DeckGL
        controller={true}
        viewState={viewState}
        layers={getLayers({ data: features, filter })}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        onHover={({ x, y, object, layer }) => {
          if (layer?.id === "sentiment-pick-layer" && object) {
            // tally up sentiment counts for the hovered feature's country
            const country = object.properties.country;
            const pts = features.filter(
              (f) => f.properties.country === country
            );
            const counts = pts.reduce(
              (acc, f) => {
                acc[f.properties.sentiment]++;
                return acc;
              },
              { positive: 0, neutral: 0, negative: 0 }
            );
            setHoverInfo({ x, y, counts });
          } else {
            setHoverInfo(null);
          }
        }}
        onClick={({ object, layer }) => {
          if (layer?.id === "sentiment-pick-layer" && object) {
            dispatch({
              type: "SELECT_COUNTRY",
              payload: object.properties.country,
            });
          }
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Map mapStyle={MAP_STYLE} reuseMaps />
      </DeckGL>

      {hoverInfo && (
        <Box
          position="absolute"
          left={hoverInfo.x + 10}
          top={hoverInfo.y + 10}
          pointerEvents="none"
          bg="whiteAlpha.900"
          p={2}
          borderRadius="md"
          boxShadow="md"
          zIndex={2}
        >
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="bold">
              Breakdown
            </Text>
            <Text fontSize="xs">Positive: {hoverInfo.counts.positive}</Text>
            <Text fontSize="xs">Neutral: {hoverInfo.counts.neutral}</Text>
            <Text fontSize="xs">Negative: {hoverInfo.counts.negative}</Text>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
