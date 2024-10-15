"use client";

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Flame } from 'lucide-react';
import dayjs from 'dayjs';

const DailyStreaks = () => {
  const [user] = useAuthState(auth);
  const [streakDates, setStreakDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStreak, setSelectedStreak] = useState(null);

  useEffect(() => {
    const fetchStreak = async () => {
      if (!user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const completedDates : any = userData.languages
            ? Object.values(userData.languages).flatMap((lang : any) =>
                lang.lessonsCompletedOn || []
              )
            : [];
          setStreakDates(completedDates);
        }
      } else {
        const dummyStreak : any = Array.from({ length: 5 }, (_, index) =>
          dayjs().subtract(index, 'day').format('YYYY-MM-DD')
        );
        setStreakDates(dummyStreak);
      }
      setLoading(false);
    };

    fetchStreak();
  }, [user]);

  const handleStreakClick = (date : any) => {
    setSelectedStreak(date === selectedStreak ? null : date);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        Your Daily Streaks
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {streakDates.length > 0 ? (
            streakDates.map((date, index) => (
              <div
                key={index}
                className={`relative cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  selectedStreak === date ? 'ring-4 ring-indigo-500' : ''
                }`}
                onClick={() => handleStreakClick(date)}
              >
                <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col justify-between items-center">
                  <Flame
                    className={`w-12 h-12 ${
                      selectedStreak === date
                        ? 'text-red-500 animate-pulse'
                        : 'text-orange-400'
                    }`}
                  />
                  <div className="text-center mt-12">
                    <p className="font-semibold text-indigo-700">
                      {dayjs(date).format('MMM D')}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {index === 0 ? 'Today' : `${index + 1} days ago`}
                    </p>
                  </div>
                </div>
                {selectedStreak === date && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <p className="text-white text-center px-2">
                      Great job! Keep the streak going! 🎉
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600">
              <p>No streaks yet. Start learning to build your streak!</p>
              <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                Start Learning
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyStreaks;