import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./Index";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="bg-black">
      <Router>
        <UserProvider>
          <Navbar />
          <div className="pt-16">
            <Index />
          </div>
        </UserProvider>
      </Router>
    </div>
  );
};

export default App;
