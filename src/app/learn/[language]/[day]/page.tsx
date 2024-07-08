'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  Button,
  Typography,
  Box,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';

const LessonPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [lessons, setLessons] = useState<{ words: string[], sentences: string[] } | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { language, day } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchLessons = async () => {
      if (language && day) {
        const response = await fetch('/api/learn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ language, day }),
        });
        const data = await response.json();
        setLessons(data);
      }
    };

    fetchLessons();
  }, [language, day]);

  const handleNext = async () => {
    if (lessons && currentIndex < lessons.words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (lessons) {
      if (user) {
        try {
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const nextDay = (parseInt(day as string) || 1) + 1;

            await setDoc(userRef, { [`languages.${language}`]: nextDay }, { merge: true });

            const nextDayLessons = await fetch(`/api/learn`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ language, day: nextDay }),
            }).then(res => res.json());

            setLessons(nextDayLessons);
            setCurrentIndex(0);
            router.push(`/learn/${language}/${nextDay}`);
          }
        } catch (error) {
          console.error('Error updating the day:', error);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (lessons && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    if (lessons && currentIndex === lessons.words.length - 1) {
      setOpenDialog(true);
    }
  }, [currentIndex, lessons]);

  return (
    <div className="p-4">
      <Typography variant="h5" className="text-center mb-4">Lessons for {language} - Day {day}</Typography>
      {lessons && (
        <div className="space-y-4">
          <Typography variant="h6">Word: {lessons.words[currentIndex]}</Typography>
          <Typography variant="body1">Sentence: {lessons.sentences[currentIndex]}</Typography>
          <LinearProgress
            variant="determinate"
            value={(currentIndex + 1) / lessons.words.length * 100}
            sx={{ marginBottom: 2 }}
          />
          <Box display="flex" justifyContent="space-between">
            <Button onClick={handlePrevious} disabled={currentIndex === 0}>Previous</Button>
            <Button onClick={handleNext} disabled={currentIndex === lessons.words.length - 1}>Next</Button>
          </Box>
        </div>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>
          <CheckCircleOutline color="success" /> Congratulations!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have completed today's lessons.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LessonPage;
