import React from "react";
import ReactDOM from "react-dom/client"; // React 19 uses createRoot
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider value={defaultSystem}>
    <App />
  </ChakraProvider>
);
