import React from "react";
import NavBar from "./NavBar";

export default function page() {
  return (
    <div className="font-sans">
      <div>
        <NavBar />
      </div>
      <div className="flex flex-col items-center bg-[#0352a1] min-h-screen pt-20 text-white">
        {/* Header */}
        <header className="text-4xl sm:text-5xl font-poppins font-bold pt-10">
          Welcome to PESU Sports
        </header>
        <p className="text-lg mt-4 text-center max-w-2xl font-roboto">
          Book your favorite courts easily and experience the spirit of sports
          at PES University.
        </p>

        {/* Courts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 px-8 w-full max-w-6xl">
          {/* Badminton */}
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg group">
            <img
              src=""
              alt="Badminton Court"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center">
              <h2 className="text-2xl font-semibold font-poppins">Badminton</h2>
              <p className="text-sm mt-2 text-center max-w-[80%]">
                Enjoy indoor badminton courts with professional flooring and
                lighting.
              </p>
            </div>
          </div>

          {/* Basketball */}
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg group">
            <img
              src=""
              alt="Basketball Court"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center">
              <h2 className="text-2xl font-semibold font-poppins">
                Basketball
              </h2>
              <p className="text-sm mt-2 text-center max-w-[80%]">
                Full-sized outdoor and indoor basketball courts available for
                all players.
              </p>
            </div>
          </div>

          {/* Table Tennis */}
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg group">
            <img
              src=""
              alt="Table Tennis"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center">
              <h2 className="text-2xl font-semibold font-poppins">
                Table Tennis
              </h2>
              <p className="text-sm mt-2 text-center max-w-[80%]">
                Play fast-paced table tennis matches with top-quality equipment.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 mb-10 text-sm text-gray-300">
          © {new Date().getFullYear()} PESU Sports — All rights reserved.
        </footer>
      </div>
    </div>
  );
}
