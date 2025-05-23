// src/App.tsx
import React from "react";
import { ChakraProvider, Spinner, Center, Text } from "@chakra-ui/react";
import { useSentimentData } from "./hooks/useSentimentData";
import {
  SentimentProvider,
  useSentimentContext,
} from "./context/SentimentContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Controls from "./components/Controls";
import MapContainer from "./components/MapContainer";
import Legend from "./components/Legend";

function InnerApp() {
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

export default function App() {
  return (
    <ChakraProvider>
      <SentimentProvider>
        <ErrorBoundary>
          <InnerApp />
        </ErrorBoundary>
      </SentimentProvider>
    </ChakraProvider>
  );
}
