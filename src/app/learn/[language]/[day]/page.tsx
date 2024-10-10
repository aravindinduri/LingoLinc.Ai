'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Box, Typography, Button, CircularProgress, Snackbar } from '@mui/material';
import { Alert } from '@mui/lab';

const Lesson = ({ params }: { params: { language: string; day: string } }) => {
  const [user] = useAuthState(auth);
  const [lessonData, setLessonData] = useState<{ words: string[]; sentences: string[] } | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [streakUpdated, setStreakUpdated] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const router = useRouter();

  const { language, day } = params;

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch('/api/learn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language, day }),
        });

        if (response.ok) {
          const data = await response.json();
          setLessonData(data);
        } else {
          console.error('Failed to fetch lesson data');
        }
      } catch (error) {
        console.error('Error fetching lesson data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [language, day]);

  const handleNext = async () => {
    if (!lessonData) return;

    if (currentWordIndex < (lessonData.words.length ?? 0) - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else if (currentSentenceIndex < (lessonData.sentences.length ?? 0) - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
    } else {
      await completeLesson();
    }
  };

  const completeLesson = async () => {
    if (!user || !lessonData) return;

    try {
      const userRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const completedDays = userData.languages?.[language] || 0;

        const today = new Date().toISOString().split('T')[0];
        const lastCompletedDate = userData.lastCompletedDate || '';

        let newStreak = userData.streak || 0;

        if (today === lastCompletedDate) {
          return;
        } else if (today === new Date(new Date(lastCompletedDate).setDate(new Date(lastCompletedDate).getDate() + 1)).toISOString().split('T')[0]) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }

        await updateDoc(userRef, {
          [`languages.${language}`]: completedDays + 1,
          streak: newStreak,
          lastCompletedDate: today,
          completedDays: (userData.completedDays || 0) + 1,
        });

        setStreakUpdated(true);
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error('Error updating lesson completion:', error);
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleHome = () => {
    router.push('/home');
  };

  const handleNextLesson = () => {
    const nextDay = parseInt(day) + 1;
    router.push(`/learn/${language}/${nextDay}`);
  };

  if (loading) {
    return (
      <Box p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4}>Lesson for {language} - Day {day}</Typography>
      <Box mb={4}>
        <Typography variant="h6">Word:</Typography>
        <Typography variant="body1">
          {lessonData?.words[currentWordIndex] || 'No word available'}
        </Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="h6">Sentence:</Typography>
        <Typography variant="body1">
        {Array.isArray(lessonData?.words) && lessonData.words[currentWordIndex]
    ? lessonData.words[currentWordIndex]
    : 'No word available'}        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
      >
        {currentWordIndex < (lessonData?.words.length ?? 0) - 1 || currentSentenceIndex < (lessonData?.sentences.length ?? 0) - 1 ? 'Next' : 'Complete Lesson'}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleHome}
        sx={{ ml: 2 }}
      >
        Go to Home
      </Button>
      {currentWordIndex === (lessonData?.words.length ?? 0) - 1 && currentSentenceIndex === (lessonData?.sentences.length ?? 0) - 1 && (
        <Button
          variant="contained"
          color="success"
          onClick={handleNextLesson}
          sx={{ mt: 2 }}
        >
          Next Lesson
        </Button>
      )}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Congratulations! You've completed the lesson.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Lesson;
