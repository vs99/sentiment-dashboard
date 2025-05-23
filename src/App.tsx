// src/App.tsx
import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { SentimentProvider } from "./context/SentimentContext";
import ErrorBoundary from "./components/ErrorBoundary";
import InnerApp from "./InnerApp"; // your spinner→map/dashboard component
import "./App.css";

// Create (or customize) your Chakra theme
const theme = extendTheme();

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <SentimentProvider>
        <ErrorBoundary>
          <InnerApp />
        </ErrorBoundary>
      </SentimentProvider>
    </ChakraProvider>
  );
}
