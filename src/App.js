import React from "react";

import "antd/dist/reset.css"; // Import Ant Design styles
import SignUp from "./components/SignUp";
import { BrowserRouter as Router,Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/LogIn";
import AdminDashboard from "./components/Dashboards/Admin";
import EditorDashboard from "./components/Dashboards/Editor";




const App = () => {
  return (
  <Router>
    <Routes>
     
    <Route  path="/" element={<Navigate to="/login"/>}/>
      <Route  path="/login" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
      <Route path="/editor-dashboard" element={<EditorDashboard/>}/>
    </Routes>
  </Router>
  );
};

export default App;
