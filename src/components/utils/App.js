import React from "react";
import "antd/dist/reset.css";
import SignUp from "../pages/SignUp";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../pages/LogIn";
import GoogleMapAdmin from "../feautures/Admin";
import GoogleMapEditor from "../feautures/Editor";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin-dashboard" element={<GoogleMapAdmin />} />
        <Route path="/editor-dashboard" element={<GoogleMapEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
