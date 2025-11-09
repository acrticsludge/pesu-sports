"use client";
import React, { createContext, useState, useContext } from "react";

type SlotContextType = {
  selectedSlot: { day: number; hour: number | null };
  setSelectedSlot: (slot: { day: number; hour: number | null }) => void;
};

const SlotContext = createContext<SlotContextType | undefined>(undefined);

export const SlotProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedSlot, setSelectedSlot] = useState<{
    day: number;
    hour: number | null;
  }>({
    day: 0,
    hour: null,
  });

  return (
    <SlotContext.Provider value={{ selectedSlot, setSelectedSlot }}>
      {children}
    </SlotContext.Provider>
  );
};

type Booking = {
  timeSlot: string;
  bookingDate: string;
};

type ActiveSubTabProps = {
  bookingsForDay: Booking[];
  activeDay: number;
  setActiveDay: (d: number) => void;
};

export const useSlot = () => {
  const context = useContext(SlotContext);
  if (!context) throw new Error("useSlot must be used within SlotProvider");
  return context;
};

const ActiveSubTab = ({
  bookingsForDay,
  activeDay,
  setActiveDay,
}: ActiveSubTabProps) => {
  const { selectedSlot, setSelectedSlot } = useSlot();

  const today = new Date();
  const currentHour = today.getHours();

  const dayLabels = [
    { label: "Today", date: new Date() },
    {
      label: "Tomorrow",
      date: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d;
      })(),
    },
    {
      label: "Day After",
      date: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        return d;
      })(),
    },
  ];

  const startHour = 8;
  const endHour = 22;
  const hours = Array.from(
    { length: endHour - startHour },
    (_, i) => startHour + i
  );

  function normalizeBookingDate(dateStr: string): string {
    // Convert "11/9/2025" to "2025-11-09"
    const d = new Date(dateStr);
    return d.toISOString().slice(0, 10);
  }

  function isBooked(hr: number, dateStr: string) {
    const slotStr = `${String(hr).padStart(2, "0")}:00-${String(
      hr + 1
    ).padStart(2, "0")}:00`;
    return bookingsForDay.some((booking) => {
      const normalizedTimeSlot = booking.timeSlot.replace(/\s/g, "");
      const normalizedBookingDate = normalizeBookingDate(booking.bookingDate);
      return (
        normalizedTimeSlot === slotStr && normalizedBookingDate === dateStr
      );
    });
  }

  function isLocked(hr: number, isToday: boolean, dateStr: string) {
    return isToday && hr < currentHour && !isBooked(hr, dateStr);
  }

  console.log("bookingsForDay:", bookingsForDay);

  return (
    <div>
      <div className="flex border-b">
        {dayLabels.map((d, idx) => (
          <button
            key={d.label}
            className={`px-4 py-2 ${
              activeDay === idx ? "border-b-2 border-blue-600" : ""
            }`}
            onClick={() => setActiveDay(idx)}
            type="button"
          >
            {d.label} ({d.date.toLocaleDateString("en-CA")})
          </button>
        ))}
      </div>
      <div className="flex flex-wrap mt-4">
        {hours.map((hr) => {
          const slotDate = dayLabels[activeDay].date;
          const dateStr = slotDate.toISOString().slice(0, 10);
          const isToday = activeDay === 0;
          const booked = isBooked(hr, dateStr);
          const locked = isLocked(hr, isToday, dateStr);
          const isSelected =
            selectedSlot.day === activeDay && selectedSlot.hour === hr;

          let colorClass = "bg-green-400 text-white";
          if (booked) colorClass = "bg-red-500 text-white";
          else if (locked) colorClass = "bg-gray-300 text-gray-500";
          else if (isSelected) colorClass = "bg-blue-600 text-white";

          const isDisabled = booked || locked;

          return (
            <button
              key={hr}
              type="button"
              className={`m-2 px-4 py-2 rounded ${colorClass} ${
                isDisabled
                  ? "cursor-not-allowed opacity-70"
                  : "hover:bg-green-500 cursor-pointer"
              }`}
              onClick={() =>
                !isDisabled && setSelectedSlot({ day: activeDay, hour: hr })
              }
              disabled={isDisabled}
              aria-pressed={isSelected}
              aria-label={`${String(hr).padStart(2, "0")}:00 - ${String(
                hr + 1
              ).padStart(2, "0")}:00 ${
                booked ? "booked" : locked ? "locked" : "available"
              }`}
            >
              {`${String(hr).padStart(2, "0")}:00 - ${String(hr + 1).padStart(
                2,
                "0"
              )}:00`}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveSubTab;
