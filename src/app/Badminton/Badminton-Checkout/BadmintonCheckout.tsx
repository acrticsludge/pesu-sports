"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "../../UserContext";
import Footer from "../../footer";
import ProtectedRoute from "../../ProtectedRoute";

function BadmintonCheckoutClient() {
  const router = useRouter();
  const { user } = useUser();
  const params = useSearchParams();

  const day = params.get("day");
  const hour = params.get("hour");
  const tab = params.get("tab");
  const sport = params.get("sport");
  const hourInt = parseInt(hour ?? "0", 10) + 1;
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const slotDate = new Date();
  slotDate.setDate(slotDate.getDate() + (day ? parseInt(day, 10) : 0));
  const formattedDate = slotDate.toLocaleDateString();
  const dayOfWeek = slotDate.toLocaleDateString("en-US", { weekday: "long" });
  const courtNumber = tab;
  const timeSlot = `${hour}:00 - ${hourInt}:00`;

  const handleGoBack = () => {
    router.push("/Badminton");
  };

  const handleConfirmBooking = async () => {
    const booking = {
      username: user?.username || "Guest",
      srn: (user as any)?.srn || "",
      timeSlot: timeSlot,
      court: courtNumber || "",
      bookingDate: formattedDate,
      bookingMadeDate: new Date().toLocaleDateString(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport,
          section: "scheduled",
          bookingData: booking,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTimeout(() => {
          setMessage("Booking confirmed!");
          router.push(`/${sport}`);
        }, 3000);
      } else {
        setError(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="max-w-md mx-auto mt-16 p-6 bg-gray-50 rounded-lg shadow-md font-sans">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
            Confirm Your Booking Details
          </h1>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
              {message}
            </div>
          )}
          <br></br>
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            <div className="flex flex-col space-y-4 p-6">
              <div>
                <span className="block text-gray-600 font-semibold mb-1">
                  Court Number
                </span>
                <span className="text-gray-900 text-lg font-bold">
                  {courtNumber ?? "N/A"}
                </span>
              </div>

              <div>
                <span className="block text-gray-600 font-semibold mb-1">
                  Date & Day
                </span>
                <span className="text-gray-900 text-lg font-bold">{`${formattedDate} (${dayOfWeek})`}</span>
              </div>

              <div>
                <span className="block text-gray-600 font-semibold mb-1">
                  Time Slot
                </span>
                <span className="text-gray-900 text-lg font-bold">
                  {timeSlot}
                </span>
              </div>

              <div>
                <span className="block text-gray-600 font-semibold mb-1">
                  Sport
                </span>
                <span className="text-gray-900 text-lg font-bold">
                  {sport ?? "N/A"}
                </span>
              </div>

              <div>
                <span className="block text-gray-600 font-semibold mb-1">
                  Username
                </span>
                <span className="text-gray-900 text-lg font-bold">
                  {user?.username ?? "Guest"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex mt-8 space-x-4">
            <button
              onClick={handleGoBack}
              className="cursor-pointer flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Go Back
            </button>
            <button
              onClick={handleConfirmBooking}
              className="cursor-pointer flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Confirm & Book
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

export default BadmintonCheckoutClient;
