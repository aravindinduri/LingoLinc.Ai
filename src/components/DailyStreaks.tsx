import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import FireIcon from '@mui/icons-material/Fireplace'; // Ensure you have this icon installed
import WhatshotIcon from '@mui/icons-material/Whatshot';
import dayjs from 'dayjs';

const DailyStreaks = () => {
  const [user] = useAuthState(auth);
  const [streakDates, setStreakDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
      } else {
        const dummyStreak = Array.from({ length: 5 }, (_, index) =>
          dayjs().subtract(index, 'day').format('YYYY-MM-DD')
        );
        setStreakDates(dummyStreak);
      }
      setLoading(false);
    };

    fetchStreak();
  }, [user]);

  return (
    <Box sx={{  width:1000, mx: 'auto', textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Your Daily Streaks
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {streakDates.length > 0 ? (
            streakDates.map((date, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card
                  sx={{
                    bgcolor: '#ecf0eb', 
                    boxShadow: 3,
                    borderRadius: '20px', 
                    height: 100, 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <WhatshotIcon
                    sx={{
                      position: 'absolute',
                      color: 'orange',
                      fontSize: 50, 
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ mt: 10 , color :'black' }}>
                      Keep it up! 🎉
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No streaks yet. Start learning to build your streak!
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default DailyStreaks;
