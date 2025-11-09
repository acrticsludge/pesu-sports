"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import NavBar from "../NavBar";
import Footer from "../footer";
import ProtectedRoute from "../ProtectedRoute";
import BookingsTab from "./BookingsTab";

function toISODate(usDateStr: string) {
  const [month, day, year] = usDateStr.split("/");
  if (!month || !day || !year) return usDateStr;
  return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;
}

export default function UserDashboard() {
  const { user, setUser } = useUser();
  const [bookings, setBookings] = useState([]);
  type Booking = {
    username: string;
    srn: string;
    timeSlot: string;
    court: string;
    bookingDate: string;
    bookingMadeDate: string;
  };

  useEffect(() => {
    if (!user) return;

    async function fetchBookings() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/user-bookings?username=${encodeURIComponent(
            (user as any).username
          )}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok && data.bookings) {
          const normalized = data.bookings.map((b: Booking) => ({
            ...b,
            bookingDate: b.bookingDate.includes("/")
              ? toISODate(b.bookingDate)
              : b.bookingDate,
            timeSlot: b.timeSlot.replace(/\s/g, ""),
          }));
          setBookings(normalized);
        } else {
          setBookings([]);
        }
      } catch {
        setBookings([]);
      }
    }

    fetchBookings();
  }, [user]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const currentBookings = bookings.filter(
    (b) => (b as any).bookingDate >= todayStr
  );
  const pastBookings = bookings.filter(
    (b) => (b as any).bookingDate < todayStr
  );

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");

      setUser(null);
      window.location.href = "Login";
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen mt-[80px]">
        <NavBar />
        <main className="flex-grow max-w-6xl mx-auto p-6 sm:p-12">
          <h1 className="text-4xl font-poppins font-bold mb-8 text-center text-white">
            User Dashboard
          </h1>

          {user ? (
            <div className="flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-2xl p-8 font-roboto text-gray-800">
              <section className="md:w-1/3 space-y-6">
                <UserInfo label="Username" value={user.username} />
                <UserInfo label="SRN" value={(user as any).srn ?? "N/A"} />
                <UserInfo label="Email" value={(user as any).email ?? "N/A"} />
                <UserInfo
                  label="Account Type"
                  value={(user as any).accountType ?? "N/A"}
                />
                <UserInfo
                  label="Member Since"
                  value={formatDate((user as any).createdAt ?? "N/A")}
                />
                <button
                  onClick={handleLogout}
                  className="mt-6 bg-[#dc2626] text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200 cursor-pointer w-full"
                  aria-label="Logout"
                  type="button"
                >
                  Logout
                </button>
              </section>
              <section className="md:w-2/3">
                <BookingsTab bookings={bookings} />
              </section>
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Loading user information...
            </p>
          )}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

function UserInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-200 pb-3">
      <span className="font-semibold text-lg text-[#0352a1]">{label}:</span>
      <span className="text-lg">{value}</span>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "N/A";

  try {
    const datePart = value.slice(0, 10);
    const date = new Date(datePart);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}
