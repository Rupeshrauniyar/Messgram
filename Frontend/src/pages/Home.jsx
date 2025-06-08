import React, {useContext, useEffect} from "react";
import {UserContext} from "../context/UserContext";
import axios from "axios";
import {User} from "lucide-react";
import {Link} from "react-router-dom";
import {io} from "socket.io-client";
const BACKENDURL = import.meta.env.VITE_BACKEND;


const Home = () => {
  const {user} = useContext(UserContext);


  return (
    <>
      <div className="w-full h-full overflow-y-auto bg-black text-white z-10 pt-2">
        {/* {console.log(user)} */}
        {user.friends.length > 0 ? (
          user.friends.map((friend, index) => (
            <Link
              to={`/message/${friend._id}/${user._id}`}
              key={index}>
              <div className="card m-2 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-4 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group">
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
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">{friend.name}</h3>
                    <p className="text-sm text-zinc-400 group-hover:text-blue-300 transition-colors duration-300">@{friend.username}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full hover:bg-purple-500/40 transition-colors duration-300">
                    Message
                  </button>
                  <div className="text-xs text-zinc-500">Last seen: 2h ago</div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <>
            <h3 className="text-center pt-16">No friends available...</h3>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
