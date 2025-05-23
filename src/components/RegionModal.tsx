// src/components/RegionModal.tsx
import React from "react";

// Modal primitives come from the modal package
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/modal";

// Layout & typography from core
import { VStack, Text } from "@chakra-ui/react";

import { useSentimentContext } from "../context/SentimentContext";

export default function RegionModal() {
  const { state, dispatch } = useSentimentContext();
  const { selectedCountry, features } = state;
  const isOpen = Boolean(selectedCountry);

  const onClose = () =>
    dispatch({ type: "SELECT_COUNTRY", payload: undefined });

  if (!isOpen || !selectedCountry) return null;

  // Gather points for the selected country
  const countryPts = features.filter(
    (f) => f.properties.countryCode === selectedCountry
  );
  const total = countryPts.length;

  // Count each sentiment
  const counts = countryPts.reduce(
    (acc, f) => {
      acc[f.properties.sentiment]++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sentiment Breakdown: {selectedCountry}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {/* use gap instead of spacing */}
          <VStack gap={3} mb={4}>
            {(["positive", "neutral", "negative"] as const).map((s) => (
              <Text key={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}: {counts[s]} (
                {((counts[s] / total) * 100).toFixed(1)}%)
              </Text>
            ))}
          </VStack>
          <Text fontSize="sm" color="gray.500">
            Total points: {total}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
