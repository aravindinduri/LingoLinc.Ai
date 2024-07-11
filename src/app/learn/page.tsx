'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Button, Typography, Box, Modal } from '@mui/material';
import { CheckCircle, ArrowForward, Home } from '@mui/icons-material';

interface LessonProps {
  params: {
    language: string;
    day: string;
  };
}

const Lesson: React.FC<LessonProps> = ({ params }) => {
  const [user] = useAuthState(auth);
  const [completed, setCompleted] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [nextDay, setNextDay] = useState<number | null>(null);
  const router = useRouter();
  const { language, day } = params;

  useEffect(() => {
    const fetchLessonData = async () => {
      // Your existing lesson fetching logic
      // ...

      // Check if lesson is completed
      const userRef = doc(firestore, 'users', user?.uid as string);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const completedLessons = userData.languages?.[language]?.completedDays || 0;
        if (parseInt(day) <= completedLessons) {
          setCompleted(true);
          setNextDay(parseInt(day) + 1);
        }
      }
    };

    fetchLessonData();
  }, [language, day, user]);

  const handleClose = () => setOpen(false);
  const handleNextLesson = () => {
    if (nextDay) {
      router.push(`/learn/${language}/${nextDay}`);
    }
  };
  const handleHome = () => {
    router.push('/home');
  };

  return (
    <Box className="p-4">
      <Typography variant="h5" className="text-center mb-4">
        Lesson {day}
      </Typography>
      <div>
        {/* Lesson content goes here */}
      </div>
      {completed && (
        <>
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            color="primary"
            className="mt-4"
          >
            Lesson Completed
          </Button>

          {/* Modal for completion */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="lesson-completion-modal"
            aria-describedby="lesson-completion-modal-description"
          >
            <Box
              className="modal-content"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 300,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                textAlign: 'center',
              }}
            >
              <Typography id="lesson-completion-modal" variant="h6" component="h2">
                🎉 Congratulations! You’ve completed this lesson!
              </Typography>
              <Box mt={2}>
                <Button
                  onClick={handleHome}
                  variant="contained"
                  color="secondary"
                  startIcon={<Home />}
                >
                  Home
                </Button>
                <Button
                  onClick={handleNextLesson}
                  variant="contained"
                  color="primary"
                  startIcon={<ArrowForward />}
                  sx={{ ml: 2 }}
                >
                  Next Lesson
                </Button>
              </Box>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default Lesson;
