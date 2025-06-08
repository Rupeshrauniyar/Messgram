import React from "react";
import {UserPlus, BellIcon} from "lucide-react";
import {Link, useLocation} from "react-router-dom";
const Navbar = () => {
  const location = useLocation();
  const isCallPage = location.pathname.includes("/call");
  return (
    <>
      {isCallPage ? null : (
        <div className="z-20">
          <span className="bg-black fixed top-0 left-0 flex items-center justify-between w-full pt-6 ">
            <Link to="/">
              <h2 className="font-bold text-2xl z-100 w-full h-[50px] bg-black text-white p-2">Messgram</h2>
            </Link>
            <Link to="/notifications">
              <BellIcon className="text-white bg-black mr-4" />
            </Link>
          </span>
          <div className="h-[70px]"></div> {/* Spacer to push content below navbar */}
          {isCallPage ? null : (
            <span className="fixed bottom-2 right-2 p-4 text-white flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
              <Link to="/add-friend">
                <UserPlus className="flex items-center justify-center cursor-pointer" />
              </Link>
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
