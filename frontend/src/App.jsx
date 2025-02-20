import { useState } from "react";
import Home from "./components/Home";
import Appbar from "./components/common/Appbar";
import { Typography } from "@mui/material";

function App() {
  return (
    <>
      <Appbar />
      <Typography variant="h5" component="h2">
        Files
      </Typography>
      <Home />
    </>
  );
}

export default App;
