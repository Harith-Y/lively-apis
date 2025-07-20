"use client";
import React from "react";

export function LocalTime({ date }: { date: Date }) {
  return <span className="text-xs opacity-75">{date.toLocaleTimeString()}</span>;
} 