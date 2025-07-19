"use client";
import { useEffect, useState } from "react";

export function LocalTime({ date }: { date: Date }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(date.toLocaleTimeString());
  }, [date]);

  return <span className="text-xs opacity-75">{time}</span>;
} 