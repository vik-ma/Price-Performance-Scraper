import React from "react";
import FetchesList from "./FetchesList";

export default function Fetches() {
  return (
    <div>
        <h1>Completed Fetches</h1>
        {/* @ts-ignore */}
      <FetchesList />
    </div>
  );
}
