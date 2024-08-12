import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaRegUserCircle } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { setUserDetail } from "../redux/slice/userSlice";
import { emailVerify } from "../api_function";

const CheckEmailPage = () => {
  // const state = useSelector((state) => state.user.token);
  // console.log(state);
  const [inputData, setInputData] = useState({
    email: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleInput = async (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await emailVerify(inputData);
      if (res.error) {
        toast.error(res?.message);
        setLoading(false);
      }
      if (res?.data?.status) {
        toast.success(res?.data?.message);
        dispatch(setUserDetail(res?.data?.data));
        setInputData({
          email: "",
        });
        setLoading(false);
        navigate("/password");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-200 email-div">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome to Chat App
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border-2 px-10 py-4 bg-white">
          <form
            action="#"
            method="POST"
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="text-center user">
              <FaRegUserCircle />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter Email"
                  onChange={handleInput}
                  value={inputData.email}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={loading ? true : false}
              >
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 background border-4 border-indigo-200 border-t-indigo-500 rounded-full"
                    viewBox="0 0 24 24"
                  ></svg>
                )}
                {loading ? "Loading..." : "Email verify"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            I have no account?
            <Link to="/register">
              <span className="text-primary ms-2">Register</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default CheckEmailPage;
