import { useState } from "react";
import Home from "./components/Home";
import Appbar from "./components/common/Appbar";
import { Typography } from "@mui/material";

function App() {
  return (
    <>
      <Appbar />
      <Home />
    </>
  );
}

export default App;
