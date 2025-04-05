import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import POC from "./components/POC";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<POC />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
