"use client";

import {useState, useRef, useEffect, useContext} from "react";
import {Send, Mic, Image, Video, Paperclip, Search, MoreVertical, Phone, VideoIcon, ArrowLeft, Smile, User, Lock} from "lucide-react";
import {UserContext} from "../context/UserContext";
import {io} from "socket.io-client";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
const BACKENDURL = import.meta.env.VITE_BACKEND;
const socket = io(BACKENDURL);

import Cookies from "js-cookie";

// Custom CSS for handling long words and URLs
const messageStyles = {
  wordBreak: "break-word",
  overflowWrap: "break-word",
  hyphens: "auto",
  msHyphens: "auto",
  WebkitHyphens: "auto",
};

// Animation for the encryption notice
const fadeInAnimation = {
  opacity: 1,
  transform: "translateY(0)",
  transition: "opacity 0.5s ease-in-out, transform 0.5s ease-out",
};

const initialAnimation = {
  opacity: 0,
  transform: "translateY(10px)",
};

// Keyframes for the pulse animation
const pulseKeyframes = `
@keyframes subtle-pulse {
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
}
`;

// Style for the pulsing lock icon
const pulsingLockStyle = {
  animation: "subtle-pulse 2s infinite ease-in-out",
};

const Message = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const token = Cookies.get("token");
  const {user, setCallInitiation} = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const {receiverId, senderId} = useParams();
  const [chatId, setchatId] = useState("");
  const [chat, setChat] = useState([]);
  const [ready, setReady] = useState(false);
  const [showEncryptionNotice, setShowEncryptionNotice] = useState(false);

  // Update textarea height whenever message content changes
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set the height to scrollHeight to fit content (up to max-height set in CSS)
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]); // Changed dependency to message to update on content change

  // Function to focus the textarea and place cursor at the end
  const focusTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Place cursor at the end
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  };

  useEffect(() => {
    const GetChat = async () => {
      try {
        const response = await axios.post(
          `${BACKENDURL}/api/get-chat`,
          {receiverId},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success && response.data.chat) {
          socket.emit("initiate-chat", response.data.chat._id);
          setchatId(response.data.chat._id);
          setChat(response.data.chat);
          setReady(true);

          // Show encryption notice after chat is loaded
          setTimeout(() => {
            setShowEncryptionNotice(true);
          }, 500);
        } else {
        }
      } catch (err) {
        console.log(err);
      }
    };
    GetChat();

    socket.on("universal-message", (Data) => {
      console.log(Data);
    });
    socket.on("receive-message", (Data) => {
      console.log(Data);
      const MessageData = {
        sender: Data.sender,
        time: Data.time,
        message: Data.message,
      };
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, MessageData],
      }));
    });
  }, []);

  // Add the keyframes to the document
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement("style");
    styleElement.innerHTML = pulseKeyframes;

    // Append it to the head
    document.head.appendChild(styleElement);

    // Clean up on component unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [chat?.messages]);
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (!message.trim()) return; // Don't send empty messages

    // Preserve all line breaks and spaces when sending to backend
    const formattedMessage = message.replace(/\n{4,}/g, "\n\n\n\n");
    const Data = {
      sender: user._id,
      chatId,
      message: formattedMessage,
    };
    const MessageData = {
      sender: user._id,
      time: Date.now(),
      message: formattedMessage,
    };
    socket.emit("send-message", Data);
    setChat((prev) => ({
      ...prev,
      messages: [...prev.messages, MessageData],
    }));
    setMessage("");

    // Focus the textarea after sending
    setTimeout(focusTextarea, 0);
  };

  const handleCall = () => {
    setCallInitiation(true);
    navigate(`/call/${chatId}/${receiverId}/?initiator=true`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Handle voice input logic
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      <div className="Noscroll fixed left-0 w-full top-0 z-10 flex flex-col h-full backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-8 bg-gray-900/60 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div className="relative">
              <User className="w-10 h-10 p-1 rounded-full border-2 border-purple-500" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            {chat?.users
              ?.filter((chatUser) => chatUser._id !== user._id)
              .map((chatUser, i) => (
                <div key={i}>
                  <h2 className="font-bold">{chatUser.username}</h2>
                  <p className="text-sm text-gray-400">Online</p>
                </div>
              ))}
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              onClick={() => handleCall()}>
              <VideoIcon size={30} />
            </button>

           
            {/* <button className="text-gray-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreVertical size={20} />
            </button> */}
          </div>
        </div>

        {/* Message Display Area - will shrink when input grows */}
        <div className="Noscroll flex-grow overflow-y-auto p-4 space-y-4 pb-2 min-h-0">
          {/* End-to-End Encryption Notice */}
          {ready && (
            <div className="flex justify-center mb-6 mt-2">
              <div
                className="bg-gray-900/70 rounded-lg px-4 py-3 max-w-sm backdrop-blur-sm border border-gray-800/50 text-center"
                style={showEncryptionNotice ? fadeInAnimation : initialAnimation}>
                <div className="flex justify-center mb-2">
                  <div style={pulsingLockStyle}>
                    <Lock className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-300 font-medium">Messages in this chat are end-to-end encrypted</p>
                <p className="text-xs text-gray-400 mt-1">No one outside this chat can read or listen to them</p>
              </div>
            </div>
          )}

          {chat?.messages?.map((chatMessage, i) => (
            <div
              className={`flex ${chatMessage.sender === user._id ? "justify-end" : "justify-start"}`}
              key={i}>
              <div className="bg-gray-800/80 rounded-lg p-3 max-w-xs md:max-w-sm backdrop-blur-sm">
                <p
                  className="whitespace-pre-wrap"
                  style={messageStyles}>
                  {chatMessage.message}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - will expand as needed */}
        <div className="p-4 bg-gray-900/60 border-t border-gray-800 flex-shrink-0">
          <div className="flex items-end space-x-2">
            <button className="text-gray-400 hover:text-white transition-colors mb-3">
              <Paperclip size={20} />
            </button>
            <div className="flex-grow bg-gray-800/50 rounded-lg px-4 py-2 backdrop-blur-sm">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Type a message..."
                className="w-full bg-transparent outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onClick={focusTextarea}
                style={{
                  maxHeight: "150px",
                  minHeight: "24px", // Ensures a minimum height for the input
                  transition: "height 0.1s ease-out", // Smooth height transition
                  wordWrap: "break-word", // Ensures long words break
                  overflowWrap: "break-word", // Modern property for breaking words
                  ...messageStyles,
                }}
              />
            </div>

            {message ? (
              <button
                className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-colors"
                onClick={handleSend}>
                <Send
                  size={20}
                  className="text-white"
                />
              </button>
            ) : (
              <span className="flex justify-between mb-1 space-x-2">
                <button
                  className={` rounded-full p-2 transition-colors ${isRecording ? "bg-red-500 " : "text-gray-400 hover:text-white"}`}
                  onClick={handleVoiceInput}>
                  <Mic size={20} />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Image size={20} />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Video size={20} />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Voice Recording Indicator */}
        {isRecording && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full animate-pulse">
            Recording...
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
