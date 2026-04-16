import React from "react";

export default function Logo() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: "8px" }}
    >
      <defs>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2ecc71" />
          <stop offset="100%" stopColor="#1abc9c" />
        </linearGradient>
        <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3498db" />
          <stop offset="100%" stopColor="#2c3e50" />
        </linearGradient>
      </defs>

      {/* Outer circle ring */}
      <circle cx="50" cy="50" r="46" stroke="url(#leafGrad)" strokeWidth="2.5" fill="none" />

      {/* Leaf shape */}
      <path
        d="M50 20 C35 30, 28 48, 40 65 C52 82, 70 72, 72 55 C74 38, 60 28, 50 20Z"
        fill="url(#leafGrad)"
        opacity="0.9"
      />

      {/* Leaf vein */}
      <path
        d="M50 25 L50 58"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />

      {/* Stylized eye (vision) inside leaf */}
      <circle cx="56" cy="48" r="8" fill="white" />
      <circle cx="58" cy="48" r="4" fill="url(#eyeGrad)" />
      <circle cx="59" cy="47" r="1.5" fill="white" />

      {/* Small decorative dots (eco particles) */}
      <circle cx="35" cy="38" r="2" fill="#2ecc71" opacity="0.6" />
      <circle cx="68" cy="68" r="2" fill="#1abc9c" opacity="0.6" />
      <circle cx="30" cy="65" r="1.5" fill="#2ecc71" opacity="0.5" />
    </svg>
  );
}