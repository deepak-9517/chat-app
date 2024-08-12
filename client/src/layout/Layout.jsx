import React from "react";
import logo from "../assets/logo.png";
const Layout = () => {
  return (
    <>
      <header className="flex justify-center items-center py-3 h-20 shadow-md bg-white">
        <img src={logo} alt="" width={180} height={60} />
      </header>
    </>
  );
};

export default Layout;
