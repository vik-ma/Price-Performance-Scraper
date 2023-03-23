import React from "react";

export default function CircleCross({ strokeColor = "#fff" }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={strokeColor}>
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <rect x="0" fill="none" width="24" height="24"></rect>
        <g>
          <path d="M19.1 4.9C15.2 1 8.8 1 4.9 4.9S1 15.2 4.9 19.1s10.2 3.9 14.1 0 4-10.3.1-14.2zm-4.3 11.3L12 13.4l-2.8 2.8-1.4-1.4 2.8-2.8-2.8-2.8 1.4-1.4 2.8 2.8 2.8-2.8 1.4 1.4-2.8 2.8 2.8 2.8-1.4 1.4z"></path>
        </g>
      </g>
    </svg>
  );
}
