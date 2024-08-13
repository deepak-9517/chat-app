import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { HiUserPlus } from "react-icons/hi2";
import { BiLogOut } from "react-icons/bi";
import Avtar from "./Avtar";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logOut, searchUserByNameEmail } from "../api_function";
import { setLogout } from "../redux/slice/userSlice";
import { Link, useNavigate } from "react-router-dom";
import UpdateUserDetail from "./UpdateUserDetail";
import { GoArrowUpLeft } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import Spinner from "./Spinner";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import moment from "moment";

const Sidebar = () => {
  const [updateDetail, setUpdateDetail] = useState(false);
  const state = useSelector((state) => state.user.userDetail);
  const [allUser, setAllUser] = useState([]);
  const [searchUser, setSearchUser] = useState(false);
  const [searchInput, setSearchInput] = useState(null);
  const [loader, setLoader] = useState(false);
  const [allChatList, setAllChatList] = useState([]);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const logout = async (id) => {
    try {
      const res = await logOut(id);
      if (res.error) {
        toast.error(res.message);
      }
      if (res?.data?.status) {
        localStorage.removeItem("token");
        dispatch(setLogout());
        toast.success(res?.data?.message);
        navigate("/email");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const socketConnection = useSelector((state) => state.user.socketConnection);
  const setUserDetail = useSelector((state) => state.user.userDetail);
  const onlineUser = useSelector((state) => state.user.onlineUser);
  const userDetail = useSelector((state) => state.user.userDetail);
  // this effect is user search
  useEffect(() => {
    setLoader(true);
    setAllUser([]);
    const hitApi = async () => {
      try {
        const res = await searchUserByNameEmail(searchInput, token);
        if (res.error) {
          setLoader(false);
          setAllUser([]);
        }
        if (res?.data?.status) {
          setLoader(false);
          setAllUser(res?.data?.data);
        }
      } catch (error) {
        setLoader(false);
      }
    };
    hitApi();
  }, [searchInput]);

  useEffect(() => {
    try {
      if (socketConnection?.connected && userDetail?._id) {
        setTimeout(async () => {
          await getSocketDetail(userDetail?._id);
        }, 100);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [socketConnection?.connected, userDetail?._id]);

  function getSocketDetail(userId) {
    socketConnection.emit("sidebar", userId);
    socketConnection.on("sidebar-list", (data) => {
      console.log(data, "sidebar-record");
      const payload = data.map((con) => {
        let message = con.messages[con.messages.length - 1];
        let unseenMsg = con.messages.reduce(
          (pre, n) => (!n.seen ? pre + 1 : pre),
          0
        );
        let user = userId === con?.sender?._id ? con?.receiver : con?.sender;
        return { message, unseenMsg, user };
      });
      setAllChatList(payload);
    });
  }
  // console.log(allChatList);
  return (
    <div className="w-full h-full flex">
      <div className="bg-slate-100 w-14 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div className="top">
          <Link
            to="/"
            className="cursor-pointer h-15 w-15 flex justify-center items-center pt-2 pb-2"
            title="Chat"
          >
            <IoChatbubbleEllipsesSharp size={30} />
          </Link>
          <div
            className="cursor-pointer h-15 w-15 flex justify-center items-center pt-2 pb-2 mt-3"
            title="Add friend"
            onClick={() => setSearchUser(true)}
          >
            <HiUserPlus size={30} />
          </div>
        </div>
        <div className="bottom">
          <div
            className="cursor-pointer flex justify-center items-center mt-3 border-2 rounded-full "
            title={`${state.name}`}
            onClick={() => setUpdateDetail(true)}
          >
            <Avtar
              userId={state?._id}
              name={state?.name}
              profile={state?.profile}
            />
          </div>
          <div
            className="logout cursor-pointer h-15 w-15 flex justify-center items-center pt-2 pb-2 mt-3 -ms-2"
            title="Logout"
            onClick={() => logout(state._id)}
          >
            <BiLogOut size={30} />
          </div>
        </div>
      </div>
      {updateDetail && (
        <UpdateUserDetail
          setUpdateDetail={setUpdateDetail}
          userDetail={state}
        />
      )}

      <div className="w-full">
        <p className="fs-3 mt-4 ms-3 fw-bold">Message</p>
        <hr className="mt-3" />
        {allChatList.length <= 0 ? (
          <div className="flex justify-center items-center w-full flex-col">
            <p className="fs-1 mt-12 fw-bold text-slate-400 mb-3">
              <GoArrowUpLeft />
            </p>
            <p className="fs-5 ms-4 text-slate-400">
              Explore users to start a conversation with.
            </p>
          </div>
        ) : (
          allChatList.map((data, index) => {
            return (
              <Link
                to={`/${data?.user?._id}`}
                key={index}
                className="cursor-pointer"
              >
                <div className="profile flex mt-4 p-2 mx-1 justify-between hover:bg-gray-100">
                  <div className="name  flex">
                    <Avtar
                      userId={data?.user?._id}
                      name={data?.user?.name}
                      profile={data?.user?.profile}
                    />
                    <div className="ms-2">
                      <p className="text-xl font-normal">{data?.user?.name}</p>
                      <p className="text-gray-400">
                        {data?.message?.imageUrl ? (
                          <p className="flex ">
                            <FaImage className="mt-1" />{" "}
                            <span className="ms-1">Image</span>
                          </p>
                        ) : (
                          ""
                        )}
                        {data?.message?.videoUrl ? (
                          <p className="flex ">
                            <FaVideo className="mt-1" />{" "}
                            <span className="ms-1">Video</span>
                          </p>
                        ) : (
                          ""
                        )}
                        {data?.message?.text && data?.message?.text.length > 10
                          ? data?.message?.text.slice(0, 10) + "..."
                          : data?.message?.text}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    {data.unseenMsg != 0 &&
                    data?.message?.msgByUserId != userDetail?._id ? (
                      <p className="bg-green-800 h-6 w-6 text-white rounded-full text-center float-end">
                        {data.unseenMsg}
                      </p>
                    ) : (
                      ""
                    )}

                    {onlineUser.includes(data?.user?._id) ? (
                      <p className="mt-2 text-green-700">online</p>
                    ) : (
                      <p>{moment(data?.message?.updatedAt).format("hh:mm")}</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {searchUser && (
        <>
          <div className=" fixed top-0 left-0 h-full w-full bg-slate-400 bg-opacity-30 p-2 z-20">
            <div className="serch-cut flex justify-end ">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setSearchUser(false)}
              />
            </div>
            <div className=" flex items-center flex-col z-10">
              <div className="mt-5 bg-white h-12 flex justify-between w-96 rounded-sm">
                <input
                  type="text"
                  id="search"
                  name="search"
                  placeholder="Search for name, email..."
                  className="form-control border-none"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <div className="search-icon p-3 -mt-2 cursor-pointer">
                  <IoSearch size={30} />
                </div>
              </div>
              <div className="mt-2 bg-white w-96 rounded-sm">
                {loader && (
                  <div className="spinner flex justify-center mt-2">
                    <Spinner />
                  </div>
                )}
                {allUser.length == 0 && (
                  <div className="text-center mt-2">No record found..!</div>
                )}
                {allUser.length >= 1 &&
                  allUser.map((item, index) => {
                    return (
                      <div
                        onClick={() => {
                          setSearchUser(false);
                          navigate(`/${item?._id}`);
                        }}
                        key={item?._id}
                        className="flex pt-3 ps-3 pb-2 cursor-pointer hover:bg-slate-100"
                      >
                        <div className="profile w-10 h-10 rounded-full overflow-hidden">
                          <Avtar
                            userId={item?._id}
                            name={item?.name}
                            profile={item?.profile}
                          />
                        </div>
                        <div className="ms-2 text-lg">{item.name}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
