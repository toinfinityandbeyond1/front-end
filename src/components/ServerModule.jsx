// src/components/ServerModule.jsx
import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, VStack } from "@chakra-ui/react";

export default function ServerModule({ name }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch — replace with actual API call
    setTimeout(() => {
      setStatus({
        capacity: "5 GB",
        used: "2.3 GB",
        tables: 12,
        rows: 15832,
        uptime: "99.9%",
      });
      setLoading(false);
    }, 800);
  }, [name]);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      shadow="md"
      p={4}
      _hover={{ shadow: "lg" }}
      minW="250px"
    >
      <Heading as="h3" size="md" mb={3}>
        {name}
      </Heading>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <VStack align="start" spacing={1} fontSize="sm">
          <Text><strong>Capacity:</strong> {status.capacity}</Text>
          <Text><strong>Used:</strong> {status.used}</Text>
          <Text><strong>Tables:</strong> {status.tables}</Text>
          <Text><strong>Rows:</strong> {status.rows.toLocaleString()}</Text>
          <Text><strong>Uptime:</strong> {status.uptime}</Text>
        </VStack>
      )}
    </Box>
  );
}
