"use client";
import React from "react";
import NavBar from "./NavBar";
import Footer from "./footer";
import { useRouter } from "next/navigation";

export default function page() {
  const route = useRouter();
  const handleBadmintonClick = async () => {
    route.push("Badminton");
  };
  const handleBasketballClick = async () => {
    route.push("Basketball");
  };
  const handleTableTennisClick = async () => {
    route.push("Table-Tennis");
  };

  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div className="flex flex-col items-center bg-[#0352a1] min-h-screen pt-20 text-white">
        <header className="text-4xl sm:text-5xl font-poppins font-bold pt-10">
          Welcome to PESU Sports
        </header>
        <p className="text-lg mt-4 text-center max-w-2xl font-roboto">
          Book your favorite courts easily and experience the spirit of sports
          at PES University.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 px-8 w-full max-w-6xl">
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg group">
            <img
              src="/badminton.png"
              alt="Badminton Court"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div
              className="absolute inset-0 bg-[#1f1f1f]/60 flex flex-col justify-center items-center cursor-pointer 
transition-all duration-500 ease-in-out"
              onClick={handleBadmintonClick}
            >
              <h2 className="text-2xl font-semibold font-poppins">Badminton</h2>
              <p className="text-sm mt-2 text-center max-w-[80%]">
                Enjoy indoor badminton courts with professional flooring and
                lighting.
              </p>
            </div>
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg group ">
            <img
              src="/basketball.png"
              alt="Basketball Court"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div
              className="absolute inset-0 bg-[#1f1f1f]/60 flex flex-col justify-center items-center cursor-pointer 
transition-all duration-500 ease-in-out"
              onClick={handleBasketballClick}
            >
              <h2 className="text-2xl font-semibold font-poppins">
                Basketball
              </h2>
              <p className="text-sm mt-2 text-center max-w-[80%]">
                Full-sized outdoor and indoor basketball courts available for
                all players.
              </p>
            </div>
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg group">
            <img
              src="/table-tennis.png"
              alt="Table Tennis"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div
              className="absolute inset-0 bg-[#1f1f1f]/60 flex flex-col justify-center items-center cursor-pointer 
transition-all duration-500 ease-in-out"
              onClick={handleTableTennisClick}
            >
              <h2 className="text-2xl font-semibold font-poppins">
                Table Tennis
              </h2>
              <p className="text-sm mt-2 text-center max-w-[80%]">
                Play fast-paced table tennis matches with top-quality equipment.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

