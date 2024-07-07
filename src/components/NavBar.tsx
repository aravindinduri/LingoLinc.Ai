// components/NavBar.tsx
"use client";

import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import GetStartedButton from './Button';
import { Logo } from './Logo';

const NavBar: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const handleGetStartedClick = () => {
    router.push('/pages/register');
  };

  const handleProfileClick = () => {
    router.push('/pages/profile');
  };

  const handleLogoutClick = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <Disclosure as="nav" className="bg-gray-900 sticky top-0 w-full z-20">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Logo onClick={() => router.push('/')} />
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Menu as="div" className="relative ml-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Menu.Button>
                    <img
                      src={user.photoURL || 'https://th.bing.com/th/id/OIP.OZGLuUpIGYOdnRphkYPJ-QAAAA?w=203&h=203&c=7&r=0&o=5&pid=1.7'}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full cursor-pointer"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleProfileClick}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                            >
                              Profile
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogoutClick}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </div>
              ) : (
                <GetStartedButton onClick={handleGetStartedClick} />
              )}
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};

export default NavBar;
