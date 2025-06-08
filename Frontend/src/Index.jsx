import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Message from "./pages/Message";
import Notfound from "./pages/Notfound";
import IsSignedIn from "./middleware/IsSignedIn";
import AddFriend from "./pages/Add-friend";
import Call from "./pages/Call";
import CallMonitor from "./middleware/CallMonitor";
const Index = () => {
  return (
    <div className="w-full h-screen bg-black text-white z-10">
      <Routes>
        <Route element={<IsSignedIn />}>
          <Route element={<CallMonitor />}>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/add-friend"
              element={<AddFriend />}
            />
            <Route
              path="/message/:receiverId/:senderId"
              element={<Message />}
            />
            <Route
              path="/call/:chatId/:receiverId"
              element={<Call />}
            />
            <Route
              path="*"
              element={<Notfound />}
            />
          </Route>
        </Route>

        <Route
          path="/signin"
          element={<Signin />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
      </Routes>
    </div>
  );
};

export default Index;
