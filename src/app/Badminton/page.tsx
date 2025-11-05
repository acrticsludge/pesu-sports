"use client";
import NavBar from "../NavBar";
import React, { useState } from "react";

export default function Badminton() {
  const [activeTab, setActiveTab] = useState("tab1");
  return (
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
              Tab 1
            </button>
            <button
              onClick={() => setActiveTab("tab2")}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              Tab 2
            </button>
            <button
              onClick={() => setActiveTab("tab3")}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              Tab 3
            </button>
          </div>
          {activeTab === "tab1" && (
            <div className="text-gray-700 mt-3">Content for Tab 1</div>
          )}
          {activeTab === "tab2" && (
            <div className="text-gray-700 mt-3">Content for Tab 2</div>
          )}
          {activeTab === "tab3" && (
            <div className="text-gray-700 mt-3">Content for Tab 3</div>
          )}
        </div>
        <div className="w-1/2 text-center">img</div>
      </div>
    </div>
  );
}
