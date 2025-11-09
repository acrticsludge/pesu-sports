import React, { useState } from "react";

type Booking = {
  username: string;
  srn: string;
  timeSlot: string;
  court: string;
  sport: string;
  status: "scheduled" | "active" | "completed";
  bookingDate: string;
  bookingMadeDate: string;
};

type BookingsTabProps = {
  bookings: Booking[];
};

const BookingsTab = ({ bookings }: BookingsTabProps) => {
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");

  const currentBookings = bookings.filter(
    (b) => b.status === "scheduled" || b.status === "active"
  );
  const pastBookings = bookings.filter((b) => b.status === "completed");

  const renderBooking = (b: Booking, idx: number) => (
    <tr key={idx} className="border-b">
      <td className="p-2">{b.sport}</td>
      <td className="p-2">{b.court}</td>
      <td className="p-2">{b.bookingDate}</td>
      <td className="p-2">{b.timeSlot}</td>
      <td className="p-2">{b.bookingMadeDate}</td>
      <td className="p-2">{b.username}</td>
    </tr>
  );

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <div className="flex space-x-4 border-b mb-4">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "current"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("current")}
          type="button"
        >
          Current Bookings ({currentBookings.length})
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "past"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("past")}
          type="button"
        >
          Past Bookings ({pastBookings.length})
        </button>
      </div>

      <table className="w-full border table-fixed text-left text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Sport</th>
            <th className="p-2">Court</th>
            <th className="p-2">Booking Date</th>
            <th className="p-2">Time Slot</th>
            <th className="p-2">Booked On</th>
            <th className="p-2">User</th>
          </tr>
        </thead>
        <tbody>
          {activeTab === "current"
            ? currentBookings.map(renderBooking)
            : pastBookings.map(renderBooking)}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTab;
