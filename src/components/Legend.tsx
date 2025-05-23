// Legend.tsx
import { Box, Flex, Text } from "@chakra-ui/react";

export default function Legend() {
  return (
    <Flex
      position="absolute"
      bottom="20px"
      left="20px"
      bg="whiteAlpha.900"
      p={3}
      borderRadius="md"
      align="center"
      zIndex={1}
    >
      <Text fontSize="sm" mr={2}>
        Negative
      </Text>
      <Box
        width="200px"
        height="8px"
        bgGradient="linear(to-r, red.500, yellow.300, green.500)"
      />
      <Text fontSize="sm" ml={2}>
        Positive
      </Text>
    </Flex>
  );
}
