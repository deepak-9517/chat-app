import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import {
  setUserDetail,
  setToken,
  setOnlineUser,
  setSocketConnection,
} from "../redux/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { socketUrl, url, userDetail } from "../api_function";
import logo from "../assets/logo.png";
import { io } from "socket.io-client";
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const getapi = async () => {
    try {
      const res = await userDetail(token);
      if (res?.data?.status) {
        dispatch(setUserDetail(res?.data?.data));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please Login first!");
      navigate("/email");
    }
    getapi();
  }, []);

  const location = useLocation();
  const path = location.pathname === "/";

  // socket connection

  useEffect(() => {
    const socketConnection = io(socketUrl, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    dispatch(setSocketConnection(socketConnection));

    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <>
      <div className="grid lg:grid-cols-[320px,1fr] h-screen max-h-screen">
        <section className={`bg-white ${!path && "hidden"} lg:block`}>
          <Sidebar />
        </section>

        {/* message conponent */}

        <section className={`${path && "hidden"}`}>
          <Outlet />
        </section>
        {path && (
          <div
            className={`lg:flex justify-center items-center flex-col hidden`}
          >
            <img src={logo} alt="" width={300} />
            <p className="mt-2 text-xl text-slate-400">
              Select user to send message
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
