// src/components/Controls.tsx
import React from "react";
import { Box, Text, HStack } from "@chakra-ui/react";
import { RadioGroup } from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";
import { useSentimentContext } from "../context/SentimentContext";

export default function Controls() {
  const { state, dispatch } = useSentimentContext();
  const { filter, features, selectedCountry } = state;

  const countryOptions = Array.from(
    new Set(features.map((f) => f.properties.countryCode))
  ).sort();

  const options = [
    { label: "All", value: "all" },
    { label: "Positive", value: "positive" },
    { label: "Neutral", value: "neutral" },
    { label: "Negative", value: "negative" },
  ] as const;

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

      <RadioGroup.Root
        value={filter}
        onValueChange={({ value }) =>
          dispatch({
            type: "SET_FILTER",
            payload: value as "all" | "positive" | "neutral" | "negative",
          })
        }
      >
        <HStack gap={3}>
          {options.map((opt) => (
            <RadioGroup.Item key={opt.value} value={opt.value}>
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>{opt.label}</RadioGroup.ItemText>
            </RadioGroup.Item>
          ))}
        </HStack>
      </RadioGroup.Root>

      <Text fontWeight="bold" mb={2} mt={4}>
        Zoom to Country
      </Text>
      <Select
        placeholder="World"
        value={selectedCountry ?? ""}
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
