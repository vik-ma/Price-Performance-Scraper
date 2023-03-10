import React from "react";

export default function Caret({ rotate = 0 }) {
    return (
      <svg viewBox="0 0 24 24" width="36" height="36" style={{ transform: `rotate(${rotate}deg)` }}>
        <path fill="#00a4d6" d="M7 10l5 5 5-5z" />
      </svg>
    );
  }