'use client';
import React from 'react';

type Props = { size?: number; className?: string };

export default function TomasTurecekAvatar({ size = 84, className = '' }: Props) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      className={`rounded-xl shadow-lg ${className}`}
      role="img"
      aria-label="Avatar Tomáš Tureček"
    >
      {/* pozadí / rámeček */}
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopOpacity="1" stopColor="#0f172a" />
          <stop offset="100%" stopOpacity="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="96" height="96" rx="14" fill="url(#bg)" stroke="#334155" strokeWidth="2" />

      {/* krk */}
      <ellipse cx="50" cy="64" rx="16" ry="10" fill="#e9c1a9" />

      {/* dres – červený límec */}
      <path d="M18 88c2-16 16-22 32-22s30 6 32 22H18z" fill="#ffffff" />
      <path d="M34 68c5-6 32-6 36 0-2 3-6 6-10 7H44c-4-1-8-4-10-7z" fill="#b91c1c" />
      <rect x="18" y="86" width="64" height="4" fill="#111827" opacity=".4" />

      {/* vlasy dozadu (culík) */}
      <path d="M50 26c18 0 20 12 18 24-8-4-28-4-36 0-2-12 0-24 18-24z" fill="#3b2e2a" />
      <path d="M68 40c6 8 8 16-2 18" fill="none" stroke="#2b211e" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 20c10 4 12 10 11 16-3-5-9-9-20-9s-17 4-20 9c-1-6 1-12 11-16 4-1 7-2 9-2s5 1 9 2z" fill="#3b2e2a" />

      {/* obličej */}
      <circle cx="50" cy="46" r="18" fill="#f2cfbb" />

      {/* uši */}
      <ellipse cx="32" cy="47" rx="3.5" ry="5" fill="#e7bfa8" />
      <ellipse cx="68" cy="47" rx="3.5" ry="5" fill="#e7bfa8" />

      {/* obočí */}
      <path d="M39 42c4-2 7-2 9 0" stroke="#2b211e" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 42c4-2 7-2 9 0" stroke="#2b211e" strokeWidth="2" strokeLinecap="round" />

      {/* oči */}
      <circle cx="43.5" cy="47" r="2.2" fill="#0f172a" />
      <circle cx="56.5" cy="47" r="2.2" fill="#0f172a" />

      {/* nos */}
      <path d="M50 48c0 4-2 5-3 5" stroke="#b08973" strokeWidth="2" strokeLinecap="round" />

      {/* knírek + bradka (vous) */}
      <path d="M40 54c4 2 20 2 24 0" stroke="#2b211e" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 60c0 4 8 4 8 0" fill="#2b211e" />

      {/* lem dresu (šedý proužek) */}
      <rect x="18" y="80" width="64" height="4" fill="#9ca3af" opacity=".6" />

      {/* jemný lesk */}
      <circle cx="24" cy="24" r="10" fill="#ffffff" opacity=".05" />
    </svg>
  );
}
