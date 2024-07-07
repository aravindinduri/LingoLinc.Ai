"use client";

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import { Button, LinearProgress, Typography, Box } from '@mui/material';

const Learn: React.FC = () => {
  const [user] = useAuthState(auth);
  const [language, setLanguage] = useState<string>('');
  const [day, setDay] = useState<number>(1);
  const [lessons, setLessons] = useState<{ words: string[], sentences: string[] } | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      const checkUser = async () => {
        const q = query(collection(firestore, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setIsFirstTimeUser(false);
          const userData = querySnapshot.docs[0].data();
          setLanguage(userData.language || '');
          setDay(userData.day || 1);
        }
      };
      checkUser();
    }
  }, [user]);

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
        setLessons(data);  // Set the lessons data directly
      }
    };

    if (!isFirstTimeUser) {
      fetchLessons();
    }
  }, [language, day, isFirstTimeUser]);

  const handleLanguageSelect = async (selectedLanguage: string) => {
    // Save the selected language to Firestore for the user
    if (user) {
      await setDoc(doc(firestore, 'users', user.uid), { language: selectedLanguage, day: 1 }, { merge: true });
      setLanguage(selectedLanguage);
      setDay(1);  // Set the initial day to 1
      setIsFirstTimeUser(false);
    }
  };

  const handleNext = () => {
    if (lessons && currentIndex < lessons.words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (lessons && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="p-4">
      {isFirstTimeUser ? (
        <div>
          <h2>Select a Language</h2>
          <div className="space-y-2">
            <Button 
              onClick={() => handleLanguageSelect('Spanish')} 
              variant="contained" 
              color="primary"
            >
              Spanish
            </Button>
            <Button 
              onClick={() => handleLanguageSelect('French')} 
              variant="contained" 
              color="primary"
            >
              French
            </Button>
            <Button 
              onClick={() => handleLanguageSelect('German')} 
              variant="contained" 
              color="primary"
            >
              German
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Lessons for {language} - Day {day}</h2>
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
        </div>
      )}
    </div>
  );
};

export default Learn;
