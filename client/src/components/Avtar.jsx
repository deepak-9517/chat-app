import React from "react";
import { useSelector } from "react-redux";
import user from "../assets/user.png";
import { FaUserAlt } from "react-icons/fa";

const Avtar = ({ userId, name, profile }) => {
  const user = useSelector((state) => state.user.onlineUser);
  if (!name) {
    return false;
  }
  name = name?.split(" ") || name;
  const active = user.includes(userId);
  return (
    <>
      <div className="relative">
        <div
          className=" overflow-hidden rounded-full"
          style={{ width: "50px", height: "50px" }}
        >
          {profile ? (
            <img src={profile} alt="" className="rounded-full max-h-24" />
          ) : (
            <>
              {/* <p className="mt-2 fs-3">
            {name.length > 1
              ? `${name[0][0]?.toUpperCase()}.${name[1][0]?.toUpperCase()}`
              : ` ${name[0][0]?.toUpperCase()}`}
          </p> */}
              {/* <img src={user} alt="" className="rounded-full  max-h-24" /> */}
              <p className="rounded-full  max-h-24 fs-2">
                <FaUserAlt />
              </p>
            </>
          )}
        </div>
        {active && (
          <div className="bg-green-600 p-1 z-20 absolute rounded-full right-1 bottom-1 "></div>
        )}
      </div>
    </>
  );
};

export default Avtar;
