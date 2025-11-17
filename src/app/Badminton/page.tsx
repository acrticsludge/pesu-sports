"use client";
import NavBar from "../NavBar";
import React, { useState, useEffect, Suspense } from "react";
import ActiveSubTab from "../ActiveSubTab";
import Footer from "../footer";
import { useSlot, SlotProvider } from "../ActiveSubTab";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "../ProtectedRoute";

export default function Badminton() {
  const [activeTab, setActiveTab] = useState("Court 1");
  const router = useRouter();
  const params = useSearchParams();

  const [bookings, setBookings] = useState([]);

  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const paramTab = params.get("tab");
    if (paramTab) setActiveTab(paramTab);
  }, [params]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        console.log("Fetching bookings for court:", activeTab);
        const response = await fetch(
          `http://localhost:5000/api/bookings?sport=Badminton&court=${encodeURIComponent(
            activeTab
          )}`
        );

        const data = await response.json();
        if (response.ok) {
          setBookings(data.bookings || []);
        } else {
          console.error("API error:", data.error);
          setBookings([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setBookings([]);
      }
    }
    fetchBookings();
  }, [activeTab]);

  return (
    <SlotProvider>
      <Content
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeDay={activeDay}
        setActiveDay={setActiveDay}
        bookings={bookings}
        router={router}
      />
    </SlotProvider>
  );

  function Content({
    activeTab,
    setActiveTab,
    activeDay,
    setActiveDay,
    bookings,
    router,
  }: {
    activeTab: string;
    setActiveTab: (s: string) => void;
    activeDay: number;
    setActiveDay: (d: number) => void;
    bookings: Array<any>;
    router: any;
  }) {
    const { selectedSlot } = useSlot();

    const dayLabels = [
      new Date(),
      new Date(new Date().setDate(new Date().getDate() + 1)),
      new Date(new Date().setDate(new Date().getDate() + 2)),
    ];
    const filterDate = dayLabels[activeDay].toISOString().slice(0, 10);

    const bookingsForDay = bookings.filter(
      (b) => b.bookingDate === filterDate && b.court === activeTab
    );

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
        <Suspense fallback={<div>Loading...</div>}>
          <div>
            <div className="flex flex-col items-center pt-[80px]">
              <div>
                <NavBar />
              </div>

              <header className="flex text-4xl sm:text-5xl font-poppins font-bold pt-10 items-center justify-center">
                Badminton
              </header>
              <p className="text-lg mt-4 text-center max-w-2xl font-roboto">
                Select your desired court and timing and book now!
              </p>

              <div className="flex flex-row justify-center w-full pt-10 items-center">
                <div className="bg-white rounded-2xl p-8 shadow-lg max-w-lg w-1/2 m-6">
                  <div className="flex justify-between tabs text-2xl font-bold text-[#0352a1]">
                    {["Court 1", "Court 2", "Court 3"].map((court) => (
                      <button
                        key={court}
                        onClick={() => setActiveTab(court)}
                        aria-pressed={activeTab === court}
                        className={`cursor-pointer hover:scale-105 transition-transform duration-300 px-4 py-2 ${
                          activeTab === court
                            ? "bg-gray-200 rounded-md cursor-default"
                            : ""
                        }`}
                        disabled={activeTab === court}
                      >
                        {court}
                      </button>
                    ))}
                  </div>

                  <div className="text-gray-700 mt-3">
                    <ActiveSubTab
                      bookingsForDay={bookingsForDay}
                      activeDay={activeDay}
                      setActiveDay={setActiveDay}
                    />
                  </div>
                </div>

                <div className="flex w-1/2 justify-center">
                  <img
                    src="./badminton.png"
                    alt="Badminton"
                    className="rounded-[10px] h-[261px] w-[465px]"
                  />
                </div>
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
        </Suspense>
      </ProtectedRoute>
    );
  }
}
