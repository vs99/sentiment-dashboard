// src/InnerApp.tsx
import React from "react";
import { Center, Spinner, Text } from "@chakra-ui/react";
import { useSentimentData } from "./hooks/useSentimentData";
import { useSentimentContext } from "./context/SentimentContext";
import Controls from "./components/Controls";
import MapContainer from "./components/MapContainer";
import Legend from "./components/Legend";

export default function InnerApp() {
  const { data, loading, error } = useSentimentData();
  const { dispatch } = useSentimentContext();

  React.useEffect(() => {
    if (data) {
      dispatch({ type: "SET_DATA", payload: data });
    }
  }, [data, dispatch]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh" flexDir="column">
        <Text mb={4}>Failed to load sentiment data.</Text>
        <Text color="red.500">{error.message}</Text>
      </Center>
    );
  }

  return (
    <>
      <Controls />
      <MapContainer />
      <Legend />
    </>
  );
}
