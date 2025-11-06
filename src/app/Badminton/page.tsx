"use client";
import NavBar from "../NavBar";
import React, { useState } from "react";
import ActiveSubTab from "./ActiveSubTab";
import Footer from "../footer";

export default function Badminton() {
  const [activeTab, setActiveTab] = useState("tab1");
  return (
    <div>
      <div className="flex flex-col items-center pt-[80px]">
        <div>
          <NavBar />
        </div>

        <header className="flex text-4xl sm:text-5xl font-poppins font-bold pt-10 items-center justify-center">
          Badmintion
        </header>
        <p className="text-lg mt-4 text-center max-w-2xl font-roboto">
          Select your desired court and timing and book now!
        </p>
        <div className="flex flex-row justify-center w-full pt-10">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-lg w-1/2 m-6">
            <div className="flex justify-between tabs text-2xl font-bold text-[#0352a1]">
              <button
                onClick={() => setActiveTab("tab1")}
                className="cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                Court 1
              </button>
              <button
                onClick={() => setActiveTab("tab2")}
                className="cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                Court 2
              </button>
              <button
                onClick={() => setActiveTab("tab3")}
                className="cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                Court 3
              </button>
            </div>
            {activeTab === "tab1" && (
              <div className="text-gray-700 mt-3">
                <ActiveSubTab />
              </div>
            )}
            {activeTab === "tab2" && (
              <div className="text-gray-700 mt-3">
                <ActiveSubTab />
              </div>
            )}
            {activeTab === "tab3" && (
              <div className="text-gray-700 mt-3">
                <ActiveSubTab />
              </div>
            )}
          </div>
          <div className="w-1/2 text-center">img</div>
        </div>
        <div className="">
          <button
            type="button"
            aria-label="Book Court"
            className="bg-[#22C55E] text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={() => {}}
          >
            Book Court
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
