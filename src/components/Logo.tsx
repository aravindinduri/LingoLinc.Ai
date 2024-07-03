"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface LogoProps {
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ onClick }) => {
  const router = useRouter();

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={() => onClick ? onClick() : router.push('/')}
    >
      <span className="text-white text-2xl font-semibold">LingoLinc</span>
    </div>
  );
};
