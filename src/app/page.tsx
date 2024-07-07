"use client"
import React from 'react';
import MainContent from '@/components/MainContent';
import LandingPage from '@/components/landingPage';
import { auth } from './firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

const Mainpage: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {user ? <MainContent /> : <LandingPage />}
    </div>
  );
};

export default Mainpage;
