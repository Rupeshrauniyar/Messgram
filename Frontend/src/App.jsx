import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./Index";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="">
      <Router>
        <UserProvider>
          <Navbar />
          <Index />
        </UserProvider>
      </Router>
    </div>
  );
};

export default App;
