import React, { useContext } from "react";
import { UserPlus, BellIcon, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
const Navbar = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const invalid = ["/call", "/signin", "/signup", "/forgot-password"];
  return (
    <>
      {invalid.includes(location.pathname) ? null : (
        <div
          className="fixed top-0 left-0 w-full p-3 flex items-center justify-between 
    bg-white/10 backdrop-blur-2xl  shadow-md text-white px-2"
        >
          <h1 className="text-2xl font-bold">Messgram</h1>
          <Link
            to="/notification"
            className="p-2 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition flex gap-1 items-center justify-center"
          >
            <BellIcon />
            <p className="text-red-500 font-bold">
              {user?.notification?.length}
            </p>
          </Link>
        </div>
      )}
      <div className="fixed bottom-0 left-0  w-full flex items-center justify-center ">
        <Link
          to="/"
          className="bg-green-500/50 p-4 rounded-full flex items-center justify-center  mb-2 "
        >
          <Home className="text-white   " />
        </Link>
      </div>
    </>
  );
};

export default Navbar;
