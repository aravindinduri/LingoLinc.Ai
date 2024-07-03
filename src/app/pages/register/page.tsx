"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/app/firebase/config';

const RegisterPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push('pages/login'); // Redirect after successful Google sign-in
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full z-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
        >
          <defs>
            <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4B6EE9" />
              <stop offset="100%" stopColor="#2A2A72" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="1080" fill="url(#backgroundGradient)" />
          <g>
            <circle cx="300" cy="200" r="50" fill="#1E293B" opacity="0.6">
              <animate
                attributeName="cx"
                values="300; 1920; 300"
                dur="30s"
                repeatCount="indefinite"
                keyTimes="0; 0.5; 1"
                keySplines="0.25 0.1 0.25 1"
              />
            </circle>
            <circle cx="800" cy="500" r="30" fill="#FF9F1C" opacity="0.6">
              <animate
                attributeName="cx"
                values="800; 0; 800"
                dur="25s"
                repeatCount="indefinite"
                keyTimes="0; 0.5; 1"
                keySplines="0.25 0.1 0.25 1"
              />
            </circle>
            <circle cx="1500" cy="800" r="40" fill="#FCD34D" opacity="0.6">
              <animate
                attributeName="cx"
                values="1500; 0; 1500"
                dur="35s"
                repeatCount="indefinite"
                keyTimes="0; 0.5; 1"
                keySplines="0.25 0.1 0.25 1"
              />
            </circle>
          </g>
        </svg>
      </div>
      <div className="bg-gray-800 p-12 rounded-xl shadow-lg w-96 max-w-sm mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Join the Language Learning Revolution</h1>
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400 placeholder-opacity-75 transition duration-200 ease-in-out"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400 placeholder-opacity-75 transition duration-200 ease-in-out"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400 placeholder-opacity-75 transition duration-200 ease-in-out"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-4 text-gray-400">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>
        <button 
          onClick={handleGoogleSignIn} 
          className="w-full flex items-center justify-center p-2 bg-white/20 rounded-lg border border-gray-600 text-gray-200 font-medium hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200 ease-in-out"
        >
          <img 
            src="https://pngimg.com/uploads/google/google_PNG19635.png" 
            alt="Google Logo" 
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </button>
        <p className="text-sm text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <a href="/pages/login" className="font-medium text-blue-400 hover:text-blue-300">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
