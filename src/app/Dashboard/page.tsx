"use client";
import React from "react";
import { useUser } from "../UserContext";
import NavBar from "../NavBar";
import Footer from "../footer";
import ProtectedRoute from "../ProtectedRoute";

export default function UserDashboard() {
  const { user, setUser } = useUser(); // assume your context has setUser to clear user state

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");

      // Clear user state on client after successful logout
      setUser(null);

      // Redirect to login page
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
        <main className="flex-grow max-w-4xl mx-auto p-6 sm:p-12">
          <h1 className="text-4xl font-poppins font-bold mb-8 text-center text-white">
            User Dashboard
          </h1>

          {user ? (
            <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6 font-roboto text-gray-800">
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
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Loading user information...
            </p>
          )}
        </main>

        <div className="max-w-4xl mx-auto p-6 sm:p-12">
          <button
            onClick={handleLogout}
            className="w-full bg-[#dc2626] text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200 cursor-pointer"
            aria-label="Logout"
            type="button"
          >
            Logout
          </button>
        </div>

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
    const datePart = value.slice(0, 10); // Extract "YYYY-MM-DD"
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
