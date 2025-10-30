import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
import Signup from "../pages/Signup";
const IsSignedIn = () => {
  const BACKENDURL = import.meta.env.VITE_BACKEND;
  const { user, setUser, loading, setLoading } = useContext(UserContext);
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const authenticate = async () => {
        try {
          await axios
            .get(`${BACKENDURL}/api/home`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(function (response) {
              if (response.data.success && response.data.user) {
                setUser(response.data.user);
                localStorage.setItem(
                  "user",
                  JSON.stringify(response.data.user)
                );
                setLoading(false);
              } else {
              }
            });
        } catch (err) {
          const Localuser = localStorage.getItem("user");
          if (Localuser) {
            console.log(Localuser);
            setUser(JSON.parse(Localuser));
            setLoading(false);
          } else {
            setUser(null);
            setLoading(false);
          }
        }
      };
      authenticate();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);
  return (
    <>
      {loading ? (
        <></>
      ) : user ? (
        <Outlet />
      ) : (
        <Navigate
          to="/signup"
          replace
        />
      )}
    </>
  );
};

export default IsSignedIn;
