import React, { useState } from "react";
import Avtar from "./Avtar";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import uploadFile from "../../helper/uploadFile";
import { updateUserDetail } from "../api_function";
import { setUserDetail } from "../redux/slice/userSlice";

const UpdateUserDetail = ({ setUpdateDetail, userDetail }) => {
  const [loading, setLoading] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(null);
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({
    name: userDetail.name,
    profile_pic: userDetail.profile,
  });

  const handleInput = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      let imageUrl = userDetail.profile;
      if (updateProfile) {
        res = await uploadFile(updateProfile);
        imageUrl = res.data.secure_url;
      }
      res = await updateUserDetail(
        { ...userInfo, profile_pic: imageUrl },
        token
      );
      if (res.error) {
        setLoading(false);
        toast.error(res?.message);
      }
      if (res?.data?.status) {
        setLoading(false);
        toast.success(res?.data?.message);
        dispatch(setUserDetail(res?.data?.data));
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="updateuserdetail z-20">
        <div className="update-div">
          <h2 className="ps-3 pt-3 fs-4 fw-bold">Profile Details</h2>
          <p className="ps-3">Edit user detail</p>
          <form>
            <div className="mb-3 p-3">
              <label>Name : </label>
              <input
                type="text"
                className="form-control mt-2"
                name="name"
                style={{ width: "70%" }}
                value={userInfo.name}
                onChange={handleInput}
              />
            </div>
            <div className="mb-3 p-3">
              <label>
                Photo :
                <br />
                <div className="profile d-flex mt-1">
                  <span className="border-2 rounded-full bg-gray-400 ">
                    {updateProfile ? (
                      <img
                        src={URL.createObjectURL(updateProfile)}
                        className="rounded-full w-20 h-20"
                      />
                    ) : (
                      <Avtar
                        userId={userDetail?._id}
                        name={userDetail?.name}
                        profile={userDetail?.profile}
                      />
                    )}
                  </span>

                  <input
                    type="file"
                    className="form-control"
                    hidden
                    name="profile_pic"
                    id="profile_pic"
                    onChange={(e) => setUpdateProfile(e.target.files[0])}
                  />
                  <span className="ms-4 mt-3 cursor-pointer">
                    Update Profile
                  </span>
                </div>
              </label>
              <hr className="mt-3" />
              <div className="action mt-3 float-end mb-4 flex">
                <button
                  className="btn btn-outline-danger me-3"
                  onClick={() => setUpdateDetail(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success flex w-full justify-center"
                  onClick={handleSubmit}
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 background border-4 border-indigo-200 border-t-indigo-500 rounded-full"
                      viewBox="0 0 24 24"
                    ></svg>
                  )}

                  <span>Update</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateUserDetail;
