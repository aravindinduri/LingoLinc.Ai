'use client';

import { useState } from 'react';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, userCredential, loading, error] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
  const router = useRouter();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      let user = await signInWithEmailAndPassword(email, password);
      if (!error) {
        console.log(user)
        router.push('/pages/home');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      if (!googleError) {
        router.push('/pages/home');
      }
    } catch (e) {
      console.error(e);
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
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4B6EE9" />
              <stop offset="100%" stopColor="#2A2A72" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="1080" fill="url(#grad2)" />
          <circle cx="100" cy="300" r="40" fill="#1E293B">
            <animate
              attributeName="cx"
              values="100; 1920; 100"
              dur="30s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="500" cy="100" r="30" fill="#FF9F1C">
            <animate
              attributeName="cx"
              values="500; 0; 500"
              dur="25s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="1500" cy="500" r="50" fill="#FCD34D">
            <animate
              attributeName="cx"
              values="1500; 0; 1500"
              dur="35s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
      <div className="bg-gray-800 p-12 rounded-xl shadow-lg w-96 max-w-sm mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Welcome Back to LingoLinc</h1>
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error.message}
          </div>
        )}
        {googleError && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {googleError.message}
          </div>
        )}
        <form onSubmit={handleSignIn} className="space-y-6">
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
          <button 
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          >
            {loading ? 'Signing In...' : 'Sign In'}
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
          disabled={googleLoading}
        >
          <img 
            src="https://pngimg.com/uploads/google/google_PNG19635.png" 
            alt="Google Logo" 
            className="w-5 h-5 mr-2"
          />
          {/* <Image 
            src="https://pngimg.com/uploads/google/google_PNG19635.png" 
            alt="Profile" 
            className="w-5 h-5 mr-2"
            /> */}
          {googleLoading ? 'Signing In with Google...' : 'Sign in with Google'}
        </button>
        <p className="text-sm text-center text-gray-400 mt-6">
          New to LingoLinc?{' '}
          <a href="/pages/register" className="font-medium text-blue-400 hover:text-blue-300">
            Create an Account
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
