import React from "react";
import Navigate from "./navigation";
import { ValueProvider } from "./context";

export default function App() {
  return (
   <ValueProvider>
    <Navigate />
   </ValueProvider>
  );
}


