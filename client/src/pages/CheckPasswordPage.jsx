import React, { useEffect, useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { passwordVerify } from "../api_function";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../redux/slice/userSlice";
import Avtar from "../components/Avtar";
const CheckPasswordPage = () => {
  const [inputData, setInputData] = useState({
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const state = useSelector((state) => state.user.userDetail);
  const dispatch = useDispatch();
  const handleInput = async (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (Object.keys(state).length === 0) {
      navigate("/email");
    }
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = {
        password: inputData.password,
        userId: state._id,
      };
      const res = await passwordVerify(formdata);
      if (res.error) {
        toast.error(res?.message);
        setLoading(false);
      }
      if (res?.data?.status) {
        toast.success(res?.data?.message);
        dispatch(setToken(res?.data?.token));
        localStorage.setItem("token", res?.data?.token);
        setLoading(false);
        setInputData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-200 email-div">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm"></div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border-2 px-10 py-4 bg-white">
          <form
            action="#"
            method="POST"
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="flex justify-center items-center">
              <Avtar
                userId={state?._id}
                name={state?.name}
                profile={state?.profile}
              />
            </div>
            <p className="text-center fs-5 font-normal">{state.name}</p>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="password"
                  placeholder="Enter password"
                  onChange={handleInput}
                  value={inputData.password}
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
                {loading ? "Loading..." : "Login"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {/* I have no account?
            <Link to="/register">
              <span className="text-primary ms-2">Register</span>
            </Link> */}
            Forgot Password
          </p>
        </div>
      </div>
    </>
  );
};

export default CheckPasswordPage;
