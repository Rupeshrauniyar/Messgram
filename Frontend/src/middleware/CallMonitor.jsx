import React, {useContext, useEffect} from "react";
import {UserContext} from "../context/UserContext";
import axios from "axios";
import Cookies from "js-cookie";
import {Outlet, useNavigate} from "react-router-dom";
import {io} from "socket.io-client";
import incoming from "/src/assets/incoming.mp3";

const BACKENDURL = import.meta.env.VITE_BACKEND;
const socket = io(BACKENDURL);
const CallMonitor = () => {
  const ringAudio = new Audio(incoming);
  const navigate = useNavigate();

  const {stop, setStop, incomingCall, setIncomingCall, caller, chatId, user} = useContext(UserContext);
  const acceptCall = () => {
    // socket.emit("accept-call", chatId);
    setStop(true);
    setIncomingCall(false);
    navigate(`/call/${chatId}/${user._id}/?initiator=false`);
  };
  const rejectCall = () => {
    setStop(true);
    const Data = {
      chatId,
    };
    socket.emit("close-call", Data);
    setIncomingCall(false);
  };
  useEffect(() => {
    if (incomingCall) {
      // ringAudio.play();
      // ringAudio.loop = true;
    } else {
      // ringAudio.pause();
    }
  }, [incomingCall]);
  return (
    <>
      {!incomingCall ? (
        <Outlet />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
          {/* User Avatar or Logo */}
          <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-6">
            {caller.username?.charAt(0).toUpperCase()}
          </div>

          {/* Caller Name */}
          <h2 className="text-2xl font-semibold text-white mb-8">{caller.name}</h2>

          {/* Buttons */}
          <div className="flex gap-6">
            <button
              onClick={() => acceptCall()}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow">
              Accept
            </button>
            <button
              onClick={() => rejectCall()}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow">
              Reject
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CallMonitor;
