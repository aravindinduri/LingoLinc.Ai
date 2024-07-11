import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import 'react-calendar/dist/Calendar.css';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

const DailyStreaksCalendar = () => {
  const [user] = useAuthState(auth);
  const [streakDates, setStreakDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchStreak = async () => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const completedDates = userData.languages
            ? Object.values(userData.languages).flatMap((lang: any) =>
                lang.lessonsCompletedOn || []
              )
            : [];
          setStreakDates(completedDates);
        }
      }
    };

    fetchStreak();
  }, [user]);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && streakDates.includes(dayjs(date).format('YYYY-MM-DD'))) {
      return (
        <div style={{ position: 'relative' }}>
          <img
            src="/fire-icon.png" // Replace with your fire icon path
            alt="streak"
            style={{ width: '20px', height: '20px', position: 'absolute', top: '0', right: '0' }}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h6">Daily Streaks</Typography>
      <Calendar
        tileContent={tileContent}
        locale="en-US"
      />
    </Box>
  );
};

export default DailyStreaksCalendar;
