// src/components/Data.jsx
import React from "react";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import ServerModule from "./ServerModule";

export default function Data() {
  const servers = [
    { name: "Supabase" },
    { name: "AWS RDS" },
    { name: "Local Dev Server" },
  ];

  return (
    <Box p={6} bg="yellow.50" borderRadius="lg" shadow="sm">
      <Heading as="h2" size="lg" mb={4} color="orange.700">
        Data Overview
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {servers.map((server) => (
          <ServerModule key={server.name} name={server.name} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
