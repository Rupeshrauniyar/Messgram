"use client";

import { useState, useCallback, useRef, useContext } from "react";
import { Search, UserPlus, User, UserMinus } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { UserContext } from "../context/UserContext";
import { io } from "socket.io-client";
const BACKENDURL = import.meta.env.VITE_BACKEND;
const socket = io(BACKENDURL);
const AddFriend = () => {
  const { user, setUser } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimerRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND;
  const token = Cookies.get("token");
  const debouncedSearch = useCallback(
    (term) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (term.length >= 3) {
        setIsLoading(true);
      }
      debounceTimerRef.current = setTimeout(async () => {
        if (term.length < 3) {
          setSearchResults([]);
          return;
        }

        setError(null);

        try {
          const response = await axios.post(
            `${BACKEND_URL}/api/search-users`,

            { username: term },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Add token to headers for authenticated requests
              },
            }
          );
          setSearchResults(response.data.user || []);
        } catch (err) {
          console.error("Error searching users:", err);
          setError(
            "An error occurred while searching for users. Please try again."
          );
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300); // 300ms debounce delay
    },
    [BACKEND_URL]
  ); // Added BACKEND_URL to dependencies

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleAddFriend = async (userId) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/add-friend`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers for authenticated requests
          },
        }
      );
      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          sentRequests: [...prev.sentRequests, userId],
        }));
        const Data = {
          userId,
          _id: user._id,
          username: user.username,
          message: `${user.username} has sent you a friend request`,
        };
        socket.emit("send-noti", Data);
        setSearchResults((prevResults) =>
          prevResults.map((user) =>
            user._id === userId ? { ...user, requestSent: true } : user
          )
        );
      }
      // Update UI to reflect the friend request sent
    } catch (err) {
      console.error("Error adding friend:", err);
      setError("Failed to send friend request. Please try again.");
    }
  };

  const handleCancelFriend = async (userId) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/cancel-friend`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers for authenticated requests
          },
        }
      );
      setUser((prev) => ({
        ...prev,
        sentRequests: prev.sentRequests.filter((req) => req !== userId),
      }));
      // Update UI to reflect the friend request sent
      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user._id === userId ? { ...user, requestSent: false } : user
        )
      );
    } catch (err) {
      console.error("Error adding friend:", err);
      setError("Failed to send cancel request. Please try again.");
    }
  };

  const handleAcceptReq = async (userId) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/accept-friend`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers for authenticated requests
          },
        }
      );
      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          friends: [...prev.friends, response.data.user],
        }));
        const Data = {
          userId,
          _id: user._id,
          username: user.username,
          message: `${user.username} has accepted your  friend request`,
        };
        socket.emit("send-noti", Data);
      }
    } catch (err) {
      console.error("Error accepting friend:", err);
      setError("Failed to accept friend request. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add Friend</h1>

        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:border-purple-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-800 text-red-100 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
        {/* Loading Indicator */}
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : searchTerm.length >= 3 && searchResults.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">
            No users found. Try a different search term.
          </p>
        ) : (
          <div className="space-y-4">
            {searchResults.map((searchedUser) =>
              searchedUser._id === user._id ? null : (
                <div
                  key={searchedUser._id}
                  className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <User className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold">{searchedUser.username}</h3>
                      <p className="text-sm text-gray-400">
                        {searchedUser.name}
                      </p>
                    </div>
                  </div>
                  {user.friends.some(
                    (friend) => friend._id === searchedUser._id
                  ) ? (
                    <button
                      className={`px-4 py-2 rounded-full flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition-colors`}
                    >
                      <User size={16} />
                      <span>Friends</span>
                    </button>
                  ) : user.receivedRequests.includes(searchedUser._id) ? (
                    <button
                      onClick={() => handleAcceptReq(searchedUser._id)}
                      className={`px-4 py-2 rounded-full flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition-colors`}
                    >
                      <UserPlus size={16} />
                      <span>Accept</span>
                    </button>
                  ) : !user.sentRequests.includes(searchedUser._id) ? (
                    <button
                      onClick={() => handleAddFriend(searchedUser._id)}
                      className={`px-4 py-2 rounded-full flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition-colors`}
                    >
                      <UserPlus size={20} />
                      {/* <span>Add friend</span> */}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCancelFriend(searchedUser._id)}
                      className={`px-4 py-2 rounded-full flex items-center space-x-2 bg-gray-700 text-gray-400 cursor-not-allowed`}
                    >
                      <UserMinus size={16} />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* Search Results */}

        {/* No Results Message */}
      </div>
    </div>
  );
};

export default AddFriend;
