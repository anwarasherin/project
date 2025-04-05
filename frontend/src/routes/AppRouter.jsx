import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import PublicLayout from "./PublicLayout";
import PrivateLayout from "./PrivateLayout";

import Login from "../components/Login";
import SignUp from "../components/SignUp";

import Dashboard from "../components/Dashboard";
import Settings from "../components/Settings";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
