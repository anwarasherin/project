import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Typography } from "@mui/material";

import Home from "./components/Home";
import Appbar from "./components/common/Appbar";
import BlockchainFlow from "./components/Blockchain";

function App() {
  return (
    <Router>
      <Appbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blockchain" element={<BlockchainFlow />} />
      </Routes>
    </Router>
  );
}

export default App;
