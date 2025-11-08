"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "../../UserContext";

const page = () => {
  const { user } = useUser();
  const params = useSearchParams();
  const day = params.get("day");
  const hour = params.get("hour");
  const tab = params.get("tab");
  const sport = params.get("sport");
  const hourInt = parseInt(hour ?? "0") + 1;
  const slotdate = new Date();
  slotdate.setDate(slotdate.getDate() + (day ? parseInt(day) : 0));
  return (
    <div>
      <h1>Badminton Checkout</h1>
      <div>Selected Slot: {slotdate.toLocaleDateString()}</div>
      <div>Court Number: {tab}</div>
      <div>
        Time Slot: {hour}:00-{hourInt}:00
      </div>
      <div>Sport: {sport}</div>
      <div>Username: {user?.username}</div>
    </div>
  );
};

export default page;
