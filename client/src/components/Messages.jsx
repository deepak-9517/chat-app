import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avtar from "./Avtar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoChevronBackOutline } from "react-icons/io5";
import { FaPlus, FaSmile } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import wallpaper from "../assets/wallapaper.jpeg";
import { FaImage, FaVideo } from "react-icons/fa";
import Picker from "emoji-picker-react";
import { RxCross1 } from "react-icons/rx";
import uploadFile from "../../helper/uploadFile";
import moment from "moment";
import Spinner from "./Spinner";

const Messages = () => {
  const params = useParams();
  const socketConnection = useSelector((state) => state.user.socketConnection);
  const adminDetail = useSelector((state) => state.user.userDetail);
  const [userDetail, setUserDetail] = useState({});
  const [openMedia, setOpenMedia] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const currentMessage = useRef(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({
    text: "",
    image: "",
    video: "",
  });
  const [chatMessage, setChatMessage] = useState([]);

  const onEmojiClick = (event) => {
    setMessage({ ...message, text: message.text + event.emoji });
  };

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatMessage]);

  // socket get all message and userDetail
  useEffect(() => {
    if (socketConnection?.connected && params.userId) {
      try {
        socketConnection.emit("message-page", params.userId);
        socketConnection.emit("seen", params.userId);
        socketConnection.on("user-detail", (data) => {
          setUserDetail(data);
        });
        socketConnection.on("previous-message", (data) => {
          setChatMessage(data);
        });
        // socketConnection.emit("seen", params.userId);
      } catch (error) {
        toast.error("error in message socket", error.message);
      }

      return () => {
        socketConnection.off("user-detail");
        socketConnection.off("previous-message");
      };
    }
  }, [socketConnection?.connected, params.userId]);

  // handleInput
  const handleInput = (e) => {
    if (e.target.name === "image" || e.target.name === "video") {
      setMessage({ ...message, [e.target.name]: e.target.files[0] });
    } else {
      setMessage({ ...message, [e.target.name]: e.target.value });
    }
  };

  // sender message to the user
  const sendMessage = async (e) => {
    setLoading(false);
    e.preventDefault();
    let imageUrl = "";
    let videoUrl = "";
    if (message.image) {
      try {
        let res = await uploadFile(message.image);
        imageUrl = res.data.secure_url;
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
        console.log(error);
      }
    }
    if (message.video) {
      try {
        let res = await uploadFile(message.video);
        videoUrl = res.data.secure_url;
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
        console.log(error);
      }
    }
    if (message.image || message.video || message.text) {
      if (socketConnection) {
        const sendMessage = {
          sender: adminDetail?._id,
          receiver: params.userId,
          text: message?.text,
          imageUrl: imageUrl,
          videoUrl: videoUrl,
        };
        socketConnection.emit("new message", sendMessage);
        // socketConnection.emit("new message", sendMessage);
      }
      setMessage({
        text: "",
        image: "",
        video: "",
      });
      setShowEmojiPicker(false);
      setOpenMedia(false);
      setLoading(true);
    }

    socketConnection.on("message", (data) => {
      setChatMessage(data);
    });
  };
  return (
    <>
      <div className="message h-full w-full">
        {/* Header section */}
        <header className="bg-white w-full h-20">
          <div className="flex p-3 justify-between">
            <div className="flex">
              <Link to="/" className="lg:hidden mt-2 me-2">
                <IoChevronBackOutline size={30} />
              </Link>
              <Avtar
                userId={userDetail?.id}
                name={userDetail?.name}
                profile={userDetail?.profile}
              />
              <div>
                <p className="fs-5 ms-2">{userDetail?.name}</p>
                {userDetail?.online ? (
                  <p className="ms-2 text-green-700">Online</p>
                ) : (
                  <p className="ms-2 text-gray-500">Offline</p>
                )}
              </div>
            </div>
            <div className="me-2 mt-2 cursor-pointer">
              <BsThreeDotsVertical size={25} />
            </div>
          </div>
        </header>

        {/* Chat section */}
        <div
          className="w-full h-[calc(100vh-20vh)] relative overflow-hidden"
          style={{
            backgroundImage: `url(${wallpaper})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gray-300 opacity-50"></div>
          <div className="absolute inset-0 overflow-y-scroll p-4 z-10 hide-scrollbar">
            <div className="flex flex-col space-y-2">
              {chatMessage?.length > 0 &&
                chatMessage?.map((data, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      data.msgByUserId === adminDetail?._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <p
                      ref={currentMessage}
                      className={`overflow-hidden w-fit px-2 py-1 text-lg rounded-lg max-w-80 break-words ${
                        data.msgByUserId === adminDetail?._id
                          ? "text-right bg-green-200"
                          : "bg-white"
                      }`}
                    >
                      {data?.imageUrl && (
                        <img
                          src={data?.imageUrl}
                          className={` w-fit px-2 py-1 text-lg rounded-lg max-w-80 break-words max-h-80 ${
                            data.msgByUserId === adminDetail?._id
                              ? "text-right bg-green-200"
                              : "bg-white"
                          }`}
                        />
                      )}
                      {data?.videoUrl && (
                        <video
                          src={data?.videoUrl}
                          className={` w-fit px-2 py-1 text-lg rounded-lg max-w-80 break-words max-h-80 ${
                            data.msgByUserId === adminDetail?._id
                              ? "text-right bg-green-200"
                              : "bg-white"
                          }`}
                          controls
                        />
                      )}

                      {data.text}
                      <p className="text-end text-sm text-gray-400">
                        {moment(data?.createdAt).format("hh:mm")}
                      </p>
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative w-full h-full flex items-center justify-center">
            {message.video ? (
              <div
                className="w-full h-full bg-slate-600 z-10 flex items-center justify-center"
                style={{ background: "rgba(23, 23, 23, 0.4)" }}
              >
                <RxCross1
                  size={30}
                  className="absolute top-4 right-4 cursor-pointer z-20"
                  onClick={() => setMessage({ ...message, video: "" })}
                />

                <div className="relative w-full h-[39rem] flex justify-center items-center">
                  <video
                    src={URL.createObjectURL(message.video)}
                    controls
                    className="w-80 h-80"
                  />
                </div>
              </div>
            ) : (
              message.image && (
                <div
                  className="w-full h-full bg-slate-600 z-10 flex items-center justify-center"
                  style={{ background: "rgba(23, 23, 23, 0.4)" }}
                >
                  <RxCross1
                    size={30}
                    className="absolute top-4 right-4 cursor-pointer z-20"
                    onClick={() => setMessage({ ...message, image: "" })}
                  />

                  <div className="relative w-full h-[39rem] flex justify-center items-center">
                    <img
                      src={URL.createObjectURL(message.image)}
                      alt=""
                      className="w-60 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 h-auto object-cover"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer section */}
        <div className="bg-white w-full flex" style={{ height: "5.3rem" }}>
          {/* Select image/video */}
          <div className="m-3 relative cursor-pointer hover:bg-teal-500 hover:text-white rounded-full p-2 h-12">
            <FaPlus size={30} onClick={() => setOpenMedia(!openMedia)} />
            {openMedia && (
              <div
                className="absolute bg-white rounded shadow-lg z-20"
                style={{ top: "-8rem" }}
              >
                <ul>
                  <li className="hover:bg-gray-200 hover:text-black p-3">
                    <label className="flex items-center cursor-pointer">
                      <FaImage size={25} className="text-teal-500" />
                      <span className="ms-2 text-lg text-black">Image</span>
                      <input
                        type="file"
                        id="image"
                        className="hidden"
                        name="image"
                        onChange={handleInput}
                      />
                    </label>
                  </li>
                  <li className="hover:bg-gray-200 hover:text-black p-3">
                    <label className="flex items-center cursor-pointer">
                      <FaVideo size={25} className="text-purple-500" />
                      <span className="ms-2 text-lg text-black">Video</span>
                      <input
                        type="file"
                        id="video"
                        className="hidden"
                        name="video"
                        onChange={handleInput}
                      />
                    </label>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Emoji Picker */}
          <div className="mt-3 ms-1 relative cursor-pointer hover:bg-teal-500 hover:text-white rounded-full p-2 h-12">
            <FaSmile
              size={30}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            {showEmojiPicker && (
              <div className="absolute bottom-14 left-0 z-50">
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          {/* Input and Send button */}
          <form className="flex w-full pr-3" onSubmit={sendMessage}>
            <input
              type="text"
              name="text"
              id="text"
              placeholder="Write message....."
              className="form-control flex-grow m-3 outline-none"
              value={message.text}
              onChange={handleInput}
            />

            {loading ? (
              <button
                className="text-green-500 ml-3 hover:text-green-800"
                type="submit"
              >
                <IoSend size={30} />
              </button>
            ) : (
              <p className="mt-4">
                <Spinner />
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Messages;
