import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import POC from "./components/POC";
import SignUp from "./components/SignUp";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<POC />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
