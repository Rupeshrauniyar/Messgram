import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { MoreHorizontal, User, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Home = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND;
  const token = Cookies.get("token");
  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [openId, setOpenId] = useState("");

  const DeleteFriend = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/delete-friend`,
        { userId: openId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers for authenticated requests
          },
        }
      );
      setUser((prev) => ({
        ...prev,
        friends: prev.friends.filter((req) => req === openId),
      }));
      // Update UI to reflect the friend request sent
    } catch (err) {
      console.error("Error deleting friend:", err);
      // setError("Failed to send cancel request. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full h-full overflow-y-auto bg-black text-white z-10 pt-2">
        {/* {console.log(user)} */}
        {open ? (
          <div className="fixed bottom-0 left-0 bg-zinc-800 w-full h-30 rounded-t-3xl z-100 flex items-center justify-center p-4">
            <button
              onClick={() => DeleteFriend()}
              className=" bg-red-500/50 w-full h-10 rounded-md"
            >
              Delete friend
            </button>
          </div>
        ) : null}
        {user.friends.length > 0 ? (
          user.friends.map((friend, index) => (
            <div
              key={index}
              className="card m-2 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-4 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <span></span>
                <MoreHorizontal
                  onClick={() => {
                    setOpen(true);
                    setOpenId(friend._id);
                  }}
                />
              </div>
              <Link
                to={`/message/${friend._id}/${user._id}`}
                key={index}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {user.profilePic ? (
                      <img
                        src={friend.profilePic || "/placeholder.svg"}
                        alt={friend.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-500 group-hover:border-blue-500 transition-colors duration-300"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                      {friend.name}
                    </h3>
                    <p className="text-sm text-zinc-400 group-hover:text-blue-300 transition-colors duration-300">
                      @{friend.username}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full hover:bg-purple-500/40 transition-colors duration-300">
                    Message
                  </button>
                  <div className="text-xs text-zinc-500">Last seen: 2h ago</div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <>
            <h3 className="text-center pt-16">No friends available...</h3>
          </>
        )}
        <span className="fixed bottom-2 right-2 p-4 text-white flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          <Link to="/add-friend">
            <UserPlus className="flex items-center justify-center cursor-pointer" />
          </Link>
        </span>
      </div>
    </>
  );
};

export default Home;
