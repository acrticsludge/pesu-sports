"use client";
import React from "react";
import { useUser } from "./UserContext";
import { useRouter } from "next/navigation";

function NavBar() {
  const router = useRouter();
  const { user } = useUser();
  const handleLogoClick = () => {
    router.push("/");
  };
  return (
    <div
      id="navbar"
      className="flex fixed top-0 left-0 w-full justify-between items-center bg-white h-20 px-2 box-border"
    >
      <div id="pesu-logo">
        <img
          src="/pesu_sports.png"
          alt="PES Logo"
          className="w-[100px] cursor-pointer"
          onClick={handleLogoClick}
        />
      </div>

      <nav id="links" className="flex gap-6 p-6 text-[1.125rem] m-0 font-sans">
        <a
          href="Badminton"
          className="text-black no-underline cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          Badminton
        </a>
        <a
          href="Basketball"
          className="text-black no-underline cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          Basketball
        </a>
        <a
          href="Table-Tennis"
          className="text-black no-underline cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          Table Tennis
        </a>
      </nav>

      {user ? (
        <div
          className="border-2 border-[#0352a1] text-[#0352a1] text-[1.125rem] rounded-full py-2 px-4 
      h-[46.2px] transition-colors duration-700 ease-in-out cursor-pointer hover:bg-[#0352a1] hover:text-white"
        >
          <a href="Dashboard">Welcome, {user.username}</a>
        </div>
      ) : (
        <div id="login">
          <a
            href="Login"
            rel="noopener noreferrer"
            id="login-a"
            className="border-2 border-[#0352a1] text-[#0352a1] text-[1.125rem] rounded-full py-2 px-4 
        h-[46.2px] transition-colors duration-700 ease-in-out cursor-pointer hover:bg-[#0352a1] hover:text-white"
          >
            Login
          </a>
        </div>
      )}
    </div>
  );
}

export default NavBar;
