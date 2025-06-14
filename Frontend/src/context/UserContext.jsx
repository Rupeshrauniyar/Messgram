import React, {useState, useEffect, createContext} from "react";
import {io} from "socket.io-client";
const BACKENDURL = import.meta.env.VITE_BACKEND;
const socket = io(BACKENDURL);
export const UserContext = createContext();
import incoming from "/src/assets/incoming.mp3";

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [callInitiation, setCallInitiation] = useState(false);
  const [offer, setOffer] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [caller, setCaller] = useState({});
  const [chatId, setChatId] = useState("");
  const [stop, setStop] = useState(true);
  const [loading, setLoading] = useState(true);
  socket.on(user?._id, (Data) => {
    // console.log(Data);
    // incomingAudio.play();
    setOffer(Data.offer);
    setIncomingCall(true);
    setCaller(Data.user);
    setChatId(Data.chatId);
    setStop(false);
  });
  socket.on(`${user?._id}__call-closed`, (Data) => {
    // console.log(Data);
    if (Data === chatId) {
      // console.log(Data);
      setOffer(null);
      setIncomingCall(false);
      setCaller({});
      setChatId("");
    }
  });
  return (
    <UserContext.Provider
      value={{
        stop,
        setStop,
        offer,
        setOffer,
        chatId,
        callInitiation,
        setCallInitiation,
        caller,
        incomingCall,
        setIncomingCall,
        user,
        setUser,
        loading,
        setLoading,
      }}>
      {children}
    </UserContext.Provider>
  );
};
