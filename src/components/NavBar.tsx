"use client";

import { Disclosure, Menu } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import GetStartedButton from './Button';
import { Logo } from './Logo';

const NavBar: React.FC = () => {
  const router = useRouter();

  const handleGetStartedClick = () => {
    router.push('/pages/register');  // Ensure this points to the correct route
  };

  return (
    <Disclosure as="nav" className="bg-gray-900 sticky top-0 w-full">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Logo onClick={() => router.push('/')} />
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Menu as="div" className="relative ml-3">
              <GetStartedButton onClick={handleGetStartedClick} />
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};

export default NavBar;
