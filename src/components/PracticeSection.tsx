"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/app/firebase/config';
import { collection, doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

interface LanguageSpace {
  language: string;
  activeSpeakers: number;
  listeners: number;
  status: string;
  topic: string;
  roomId?: string;
}

function PracticeSection() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [languageSpaces, setLanguageSpaces] = useState<LanguageSpace[]>([
    {
      language: 'German',
      activeSpeakers: 3,
      listeners: 12,
      status: 'active',
      topic: 'Daily Conversations in German'
    },
    {
      language: 'French',
      activeSpeakers: 2,
      listeners: 8,
      status: 'active',
      topic: 'French Culture Discussion'
    },
    {
      language: 'Spanish',
      activeSpeakers: 4,
      listeners: 15,
      status: 'active',
      topic: 'Spanish Practice for Beginners'
    },
    {
      language: 'Japanese',
      activeSpeakers: 2,
      listeners: 10,
      status: 'active',
      topic: 'Japanese Conversation Exchange'
    }
  ]);

  const handleJoinSpace = async (space: LanguageSpace) => {
    if (!user) {
      alert('Please sign in to join a language space');
      router.push('/login');
      return;
    }

    try {
      // Check if room exists or create new one
      let roomId = space.roomId;
      
      if (!roomId) {
        // Create a new room
        const roomsRef = collection(firestore, 'rooms');
        const newRoomRef = doc(roomsRef);
        roomId = newRoomRef.id;

        await setDoc(newRoomRef, {
          language: space.language,
          topic: space.topic,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          activeSpeakers: [],
          listeners: [],
          status: 'active'
        });

        // Update the local state with the new roomId
        setLanguageSpaces(spaces => 
          spaces.map(s => 
            s.language === space.language 
              ? { ...s, roomId } 
              : s
          )
        );
      }

      // Get current room data
      const roomRef = doc(firestore, 'rooms', roomId);
      const roomSnap = await getDoc(roomRef);
      const roomData = roomSnap.data();

      if (roomData) {
        // Add user to listeners by default
        const listeners = [...(roomData.listeners || [])];
        if (!listeners.includes(user.uid)) {
          listeners.push(user.uid);
          await updateDoc(roomRef, { listeners });
        }
      }

      // Navigate to the room page
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error('Error joining space:', error);
      alert('Failed to join the language space. Please try again.');
    }
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-400">
        Language Spaces
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {languageSpaces.map((space, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {space.language} Space
              </h2>
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                Live
              </span>
            </div>
            
            <h3 className="text-lg text-gray-700 mb-4">{space.topic}</h3>
            
            <div className="flex items-center gap-4 mb-6 text-gray-600">
              <div>
                <span className="font-medium">{space.activeSpeakers}</span> speaking
              </div>
              <div>
                <span className="font-medium">{space.listeners}</span> listening
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={() => handleJoinSpace(space)}
                className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!user}
              >
                {user ? 'Join Space' : 'Sign in to Join'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PracticeSection;
