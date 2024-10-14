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

<img className=' w-16' src="https://i.ibb.co/7Stn76P/lingolinc.png" alt="lingolinc" />   

</div>
  );
};
