"use client";
import React from "react";
import { useState } from "react";
import { ScrapeType } from "@/typings";

export default function ScrapeCreator(scrapeType: ScrapeType) {
  const scrapeTypeTitle: string =
    scrapeType.name === "CPU-Gaming"
      ? "CPU (Gaming Performance)"
      : scrapeType.name === "CPU-Normal"
      ? "CPU (Multi-threaded Performance)"
      : "GPU";
  return (
    <>
      <h2>{scrapeTypeTitle}</h2>
    </>
  );
}
