import React, { useState } from "react";

const ActiveSubTab = () => {
  const [activeDay, setActiveDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: number;
    hour: number | null;
  }>({ day: 0, hour: null });

  const today = new Date();

  const dayLabels = [
    { label: "Today", date: new Date() },
    {
      label: "Tomorrow",
      date: (() => {
        let d = new Date();
        d.setDate(d.getDate() + 1);
        return d;
      })(),
    },
    {
      label: "Day After",
      date: (() => {
        let d = new Date();
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

  const fmt = (h: number) => String(h).padStart(2, "0") + ":00";

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
          >
            {d.label} ({d.date.toLocaleDateString()})
          </button>
        ))}
      </div>
      <div className="flex flex-wrap mt-4">
        {hours.map((hr) => (
          <button
            key={hr}
            className={`m-2 px-4 py-2 rounded ${
              selectedSlot.day === activeDay && selectedSlot.hour === hr
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedSlot({ day: activeDay, hour: hr })}
          >
            {fmt(hr)} - {fmt(hr + 1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActiveSubTab;
