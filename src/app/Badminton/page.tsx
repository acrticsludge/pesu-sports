"use client";
import NavBar from "../NavBar";
import React, { useState, useEffect } from "react";
import ActiveSubTab from "./ActiveSubTab";
import Footer from "../footer";
import { useSlot, SlotProvider } from "./ActiveSubTab";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "../ProtectedRoute";

export default function Badminton() {
  const [activeTab, setActiveTab] = useState("Court 1");
  const router = useRouter();

  const params = useSearchParams();

  useEffect(() => {
    const paramTab = params.get("tab");
    if (paramTab) setActiveTab(paramTab);
  }, [params]);

  return (
    <SlotProvider>
      <Content
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        router={router}
      />
    </SlotProvider>
  );

  function Content({
    activeTab,
    setActiveTab,
    router,
  }: {
    activeTab: string;
    setActiveTab: (s: string) => void;
    router: any;
  }) {
    const { selectedSlot } = useSlot();

    const handleBook = () => {
      if (!selectedSlot || selectedSlot.hour == null) {
        alert("Please select a timeslot before booking.");
        return;
      }

      router.push(
        `/Badminton/Badminton-Checkout?day=${encodeURIComponent(
          String(selectedSlot.day)
        )}&hour=${encodeURIComponent(
          String(selectedSlot.hour)
        )}&tab=${encodeURIComponent(activeTab)}&sport=Badminton`
      );
    };

    return (
      <ProtectedRoute>
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
                    onClick={() => setActiveTab("Court 1")}
                    aria-pressed={activeTab === "Court 1"}
                    className={`cursor-pointer hover:scale-105 transition-transform duration-300 px-4 py-2 ${
                      activeTab === "Court 1"
                        ? "bg-gray-200 rounded-md cursor-default"
                        : ""
                    }`}
                    disabled={activeTab === "Court 1"}
                  >
                    Court 1
                  </button>
                  <button
                    onClick={() => setActiveTab("Court 2")}
                    aria-pressed={activeTab === "Court 2"}
                    className={`cursor-pointer hover:scale-105 transition-transform duration-300 px-4 py-2 ${
                      activeTab === "Court 2"
                        ? "bg-gray-200 rounded-md cursor-default"
                        : ""
                    }`}
                    disabled={activeTab === "Court 2"}
                  >
                    Court 2
                  </button>
                  <button
                    onClick={() => setActiveTab("Court 3")}
                    aria-pressed={activeTab === "Court 3"}
                    className={`cursor-pointer hover:scale-105 transition-transform duration-300 px-4 py-2 ${
                      activeTab === "Court 3"
                        ? "bg-gray-200 rounded-md cursor-default"
                        : ""
                    }`}
                    disabled={activeTab === "Court 3"}
                  >
                    Court 3
                  </button>
                </div>
                {activeTab === "Court 1" && (
                  <div className="text-gray-700 mt-3">
                    <ActiveSubTab />
                  </div>
                )}
                {activeTab === "Court 2" && (
                  <div className="text-gray-700 mt-3">
                    <ActiveSubTab />
                  </div>
                )}
                {activeTab === "Court 3" && (
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
                onClick={handleBook}
              >
                Book Court
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }
}
