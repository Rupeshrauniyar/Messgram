import React, { useState, useEffect, createContext, useRef } from "react";
import { io } from "socket.io-client";
const BACKENDURL = import.meta.env.VITE_BACKEND;
const socket = io(BACKENDURL);
export const UserContext = createContext();
import incoming from "/src/assets/incoming.mp3";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [callInitiation, setCallInitiation] = useState(false);
  const [offer, setOffer] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [caller, setCaller] = useState({});
  const [chatId, setChatId] = useState("");
  const [stop, setStop] = useState(true);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(new Audio("/src/assets/notification.mp3"));
  socket.on(user?._id, (Data) => {
    // console.log(Data);
    // incomingAudio.play();
    setOffer(Data.offer);
    setIncomingCall(true);
    setCaller(Data.user);
    setChatId(Data.chatId);
    setStop(false);
  });
  socket.on(`noti-${user?._id}`, (Data) => {
    console.log(Data);
    audioRef.current.play();
    setUser((prev) => ({
      ...prev,
      notification: Data,
    }));
    if (Data[Data.length - 1].message.includes("sent")) {
      setUser((prev) => ({
        ...prev,
        receivedRequests: [
          ...prev.receivedRequests,
          Data[Data.length - 1].sender,
        ],
      }));
    } else if (Data[Data.length - 1].message.includes("accepted")) {
      setUser((prev) => ({
        ...prev,
        sentRequests: prev.sentRequests.filter((req) => req === Data.sender),
      }));
      setUser((prev) => ({
        ...prev,
        friends: [...prev.friends, Data[Data.length - 1].sender],
      }));
    }
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
  useEffect(() => {
    socket.emit("connected", user?._id);
  }, [user?._id]);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
