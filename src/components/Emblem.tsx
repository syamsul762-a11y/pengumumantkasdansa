/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function Emblem({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg
      id="sdn-1asembagus-logo"
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Pentagon Base (Deep blue borders with Sky Blue fill as in the school's official coat of arms) */}
      <polygon
        points="50,3 95,35 78,85 22,85 5,35"
        fill="#26AAE1"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      
      {/* Internal golden wing shapes (left & right wings) */}
      {/* Left Wing */}
      <path
        d="M20,38 C15,48 18,65 37,70 C28,68 25,60 26,52 C27,45 23,41 20,38 Z"
        fill="#FFDE17"
        stroke="#000000"
        strokeWidth="0.75"
      />
      <path
        d="M16,45 C12,53 14,68 33,73 C26,70 21,63 22,54 C22,48 18,46 16,45 Z"
        fill="#FFDE17"
        stroke="#000000"
        strokeWidth="0.75"
      />
      {/* Left wing eye/dot */}
      <circle cx="27" cy="58" r="2.5" fill="#FFFFFF" stroke="#000000" strokeWidth="0.75" />
      
      {/* Right Wing */}
      <path
        d="M80,38 C85,48 82,65 63,70 C72,68 75,60 74,52 C73,45 77,41 80,38 Z"
        fill="#FFDE17"
        stroke="#000000"
        strokeWidth="0.75"
      />
      <path
        d="M84,45 C88,53 86,68 67,73 C74,70 79,63 78,54 C78,48 82,46 84,45 Z"
        fill="#FFDE17"
        stroke="#000000"
        strokeWidth="0.75"
      />
      {/* Right wing eye/dot */}
      <circle cx="73" cy="58" r="2.5" fill="#FFFFFF" stroke="#000000" strokeWidth="0.75" />

      {/* 2. Red Star at top */}
      <polygon
        points="50,11 53,20 62,20 55,25 57,34 50,29 43,34 45,25 38,20 47,20"
        fill="#E81C24"
        stroke="#000000"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />

      {/* 3. The Central Pen/Sword Pointer */}
      {/* Shaft */}
      <line x1="50" y1="28" x2="50" y2="60" stroke="#000000" strokeWidth="2" />
      {/* Pen Tip pointer pointing down to book */}
      <polygon
        points="48,52 52,52 50,66"
        fill="#000000"
        stroke="#000000"
        strokeWidth="0.5"
      />
      {/* Red & White Flag holder on pen shaft */}
      <rect x="47" y="34" width="6" height="4" fill="#E81C24" stroke="#000000" strokeWidth="0.5" />
      <rect x="47" y="38" width="6" height="4" fill="#FFFFFF" stroke="#000000" strokeWidth="0.5" />

      {/* 4. Open Book */}
      <path
        d="M32,68 C40,71 47,70 50,67 C53,70 60,71 68,68 L68,61 C60,64 53,63 50,60 C47,63 40,64 32,61 Z"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Pages lines */}
      <path d="M36,63 C41,65 46,65 48,63" stroke="#000000" strokeWidth="0.5" fill="none" />
      <path d="M52,63 C54,65 59,65 64,63" stroke="#000000" strokeWidth="0.5" fill="none" />

      {/* 5. Custom text path for slogan "ABIWARA WIDYANATA BHAKTI" */}
      <path
        id="textArc"
        d="M24,47 A25,25 0 0,1 76,47"
        fill="none"
        stroke="none"
      />
      <text fill="#FFFFFF" fontSize="4.2px" fontWeight="1000" fontFamily="sans-serif" letterSpacing="0.1">
        <textPath href="#textArc" startOffset="50%" textAnchor="middle">
          ABIWARA WIDYANATA BHAKTI
        </textPath>
      </text>

      {/* 6. Ribbon/Banner at the bottom */}
      {/* Left folding edge */}
      <polygon points="5,82 2,88 15,88" fill="#E81C24" stroke="#000000" strokeWidth="0.75" />
      <polygon points="15,88 12,94 5,88" fill="#FFFFFF" stroke="#000000" strokeWidth="0.75" />
      
      {/* Right folding edge */}
      <polygon points="95,82 98,88 85,88" fill="#E81C24" stroke="#000000" strokeWidth="0.75" />
      <polygon points="85,88 88,94 95,88" fill="#FFFFFF" stroke="#000000" strokeWidth="0.75" />

      {/* Center ribbon box */}
      <rect x="15" y="80" width="70" height="7" fill="#E81C24" stroke="#000000" strokeWidth="0.75" />
      <rect x="15" y="87" width="70" height="7" fill="#FFFFFF" stroke="#000000" strokeWidth="0.75" />
      
      {/* Label "SDN 1 ASEMBAGUS" across the white ribbon */}
      <rect x="21" y="83" width="58" height="8" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
      <text
        x="50"
        y="90"
        fill="#000000"
        fontSize="5.5px"
        fontWeight="bold"
        fontFamily="sans-serif, Arial"
        textAnchor="middle"
        letterSpacing="0.1"
      >
        SDN 1 ASEMBAGUS
      </text>
    </svg>
  );
}
