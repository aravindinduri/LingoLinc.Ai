"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

interface RoomData {
  language: string;
  topic: string;
  activeSpeakers: string[];
  listeners: string[];
  createdAt: any;
  createdBy: string;
  status: string;
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const [user] = useAuthState(auth);
  const [roomData, setRoomData] = useState<RoomData | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onSnapshot(doc(firestore, 'rooms', roomId), (doc) => {
      if (doc.exists()) {
        setRoomData(doc.data() as RoomData);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleRoleToggle = async () => {
    if (!user || !roomData) return;

    const roomRef = doc(firestore, 'rooms', roomId);
    const isSpeaking = roomData.activeSpeakers.includes(user.uid);
    
    try {
      if (isSpeaking) {
        // Switch to listener
        await updateDoc(roomRef, {
          activeSpeakers: roomData.activeSpeakers.filter(id => id !== user.uid),
          listeners: [...roomData.listeners, user.uid]
        });
      } else {
        // Switch to speaker
        await updateDoc(roomRef, {
          activeSpeakers: [...roomData.activeSpeakers, user.uid],
          listeners: roomData.listeners.filter(id => id !== user.uid)
        });
      }
    } catch (error) {
      console.error('Error toggling role:', error);
      alert('Failed to change role. Please try again.');
    }
  };

  const handleLeaveRoom = async () => {
    if (!user || !roomData) return;

    const roomRef = doc(firestore, 'rooms', roomId);
    try {
      await updateDoc(roomRef, {
        activeSpeakers: roomData.activeSpeakers.filter(id => id !== user.uid),
        listeners: roomData.listeners.filter(id => id !== user.uid)
      });
      router.push('/'); // Navigate back to home
    } catch (error) {
      console.error('Error leaving room:', error);
      alert('Failed to leave room. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to join rooms</h1>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const isSpeaking = roomData.activeSpeakers.includes(user.uid);

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{roomData.language} Room</h1>
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            {roomData.status}
          </span>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl mb-6 text-gray-700">{roomData.topic}</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Speakers</h3>
              <p className="text-gray-600">
                {roomData.activeSpeakers?.length || 0} active
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Listeners</h3>
              <p className="text-gray-600">
                {roomData.listeners?.length || 0} listening
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex gap-4">
            <button 
              onClick={handleRoleToggle}
              className={`px-6 py-2 rounded-full flex-1 transition-colors ${
                isSpeaking 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              {isSpeaking ? 'Switch to Listener' : 'Start Speaking'}
            </button>
            <button 
              onClick={handleLeaveRoom}
              className="border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-50"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 