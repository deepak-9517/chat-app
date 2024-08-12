import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profile from "../assets/upload_area.png";
import uploadFile from "../../helper/uploadFile";
import toast from "react-hot-toast";

import { userRegister } from "../api_function";

const Register = () => {
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleInput = async (e) => {
    if (e.target.name === "profile_pic") {
      setInputData({ ...inputData, [e.target.name]: e.target.files[0] });
    } else setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      let imageUrl = "";
      if (inputData.profile_pic) {
        res = await uploadFile(inputData.profile_pic);
        console.log(res.data.secure_url, "imag");
        // setInputData((prevData) => ({
        //   ...prevData,
        //   profile_pic: res.data.secure_url,
        // }));
        imageUrl = res.data.secure_url;
      }
      console.log(inputData, "Data to send");
      res = await userRegister({ ...inputData, profile_pic: imageUrl });
      if (res.error) {
        toast.error(res?.message);
        setLoading(false);
      }
      if (res?.data?.status) {
        toast.success(res?.data?.message);
        setInputData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });
        setLoading(false);
        navigate("/email");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-200">
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
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Enter Name"
                  onChange={handleInput}
                  value={inputData.name}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                {/* <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>   */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter Password"
                  autoComplete="current-password"
                  onChange={handleInput}
                  value={inputData.password}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="profile_pic"
                className="block text-sm font-medium leading-6 text-gray-900"
                onChange={handleInput}
              >
                Photo
                {inputData.profile_pic ? (
                  <img
                    src={URL.createObjectURL(inputData.profile_pic)}
                    alt=""
                    height={150}
                    width={150}
                  />
                ) : (
                  <img src={profile} alt="" height={150} width={150} />
                )}
              </label>
              <div className="mt-2">
                <input
                  id="profile_pic"
                  name="profile_pic"
                  type="file"
                  autoComplete="photo"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                  hidden
                  style={{ display: "none" }}
                  onChange={handleInput}
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
                {loading ? "Loading..." : "Register"}
              </button>
              {/* <button type="button" className="bg-indigo-500 ..." disabled>
                <svg
                  className="animate-spin h-5 w-5 mr-3 ..."
                  viewBox="0 0 24 24"
                ></svg>
                Processing...
              </button> */}
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have account?
            <Link to="/email">
              {" "}
              <span className="text-primary ms-2">Login</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
