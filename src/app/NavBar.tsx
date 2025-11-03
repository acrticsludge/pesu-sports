import React from "react";

const NavBar = () => {
  return (
    <div
      id="navbar"
      className="flex fixed top-0 left-0 w-full justify-between items-center bg-white h-20 px-2 box-border"
    >
      <div id="pesu-logo">
        <a href="/">
          <img src="/pesu_sports.png" alt="PES Logo" className="w-[100px]" />
        </a>
      </div>

      <nav id="links" className="flex gap-6 p-6 text-[1.125rem] m-0 font-sans">
        <a
          href="Badminton"
          className="text-black no-underline cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          Badmintion
        </a>
        <a
          href="#"
          className="text-black no-underline cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          Basketball
        </a>
        <a
          href="#"
          className="text-black no-underline cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          Table Tennis
        </a>
      </nav>

      <div id="login">
        <a
          href="login.html"
          target="_blank"
          rel="noopener noreferrer"
          id="login-a"
          className="border-2 border-[#0352a1] text-[#0352a1] text-[1.125rem] rounded-[20px] py-2 px-4 w-[81.33px] h-[46.2px] 
            transition-colors duration-700 ease-in-out cursor-pointer hover:bg-[#0352a1] hover:text-white"
        >
          Login
        </a>
      </div>
    </div>
  );
};

export default NavBar;
