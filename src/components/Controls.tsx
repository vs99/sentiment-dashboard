// src/components/Controls.tsx
import React from "react";
import { Box, Text, HStack, RadioGroup, Radio, Select } from "@chakra-ui/react";
import { useSentimentContext } from "../context/SentimentContext";

export default function Controls() {
  const { state, dispatch } = useSentimentContext();
  const { filter, features, selectedCountry } = state;

  const countryOptions = Array.from(
    new Set(features.map((f) => f.properties.country))
  ).sort();

  return (
    <Box
      position="absolute"
      top="20px"
      left="20px"
      bg="whiteAlpha.900"
      p={3}
      borderRadius="md"
      zIndex={1}
    >
      <Text fontWeight="bold" mb={2}>
        Sentiment Filter
      </Text>

      <RadioGroup
        onChange={(val) =>
          dispatch({ type: "SET_FILTER", payload: val as any })
        }
        value={filter}
      >
        <HStack spacing={3}>
          <Radio value="all">All</Radio>
          <Radio value="positive">Positive</Radio>
          <Radio value="neutral">Neutral</Radio>
          <Radio value="negative">Negative</Radio>
        </HStack>
      </RadioGroup>

      <Text fontWeight="bold" mb={2} mt={4}>
        Zoom to Country
      </Text>
      <Select
        placeholder="World"
        value={selectedCountry || ""}
        onChange={(e) =>
          dispatch({
            type: "SELECT_COUNTRY",
            payload: e.target.value || undefined,
          })
        }
      >
        {countryOptions.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </Select>
    </Box>
  );
}
