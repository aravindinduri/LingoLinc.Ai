"use client";

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { collection, getDocs, query, where, setDoc, doc, getDoc } from 'firebase/firestore';
import { Button, LinearProgress, Typography, Box, Card, CardContent, Grid } from '@mui/material';

// Define the popular languages
const popularLanguages = [
  'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 
  'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Bengali', 
  'Turkish', 'Vietnamese', 'Swahili'
];

const Learn: React.FC = () => {
  const [user] = useAuthState(auth);
  const [language, setLanguage] = useState<string>('');
  const [day, setDay] = useState<number>(1);
  const [lessons, setLessons] = useState<{ words: string[], sentences: string[] } | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(true);
  const [userLanguages, setUserLanguages] = useState<string[]>([]);
  const [showLanguageSelector, setShowLanguageSelector] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(firestore, 'users', user.uid);
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUserLanguages(userData.languages || []);
          setIsFirstTimeUser(userData.languages.length === 0);
          if (userData.language) {
            setLanguage(userData.language);
            setDay(userData.day || 1);
          }
        } else {
          await setDoc(userRef, { languages: [], day: 1 });
          setUserLanguages([]);
        }
      };
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    const fetchLessons = async () => {
      console.log('ghj')
      if (language && day) {
        try {
          const lessonRef = doc(firestore, 'users', user!.uid, 'languages', language, 'lessons', `${day}`);
          const docSnapshot = await getDoc(lessonRef);
          if (docSnapshot.exists()) {
            const lessonData = docSnapshot.data();
            setLessons(lessonData as { words: string[], sentences: string[] });
          } else {
            const response = await fetch('/api/learn', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ language, day }),
            });
            const data = await response.json();
            setLessons(data);
            await setDoc(lessonRef, data);
          }
        } catch (error) {
          console.error("Error fetching lessons:", error);
        }
      }
    };

    if (!isFirstTimeUser) {
      fetchLessons();
    }
  }, [language, day, isFirstTimeUser]);

  const handleLanguageSelect = async (selectedLanguage: string) => {
    if (user) {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, { 
          languages: [...userLanguages, selectedLanguage],
          language: selectedLanguage,  
          day: 1
        }, { merge: true });
        setUserLanguages(prevLanguages => [...prevLanguages, selectedLanguage]);
        setLanguage(selectedLanguage);
        setDay(1);
        setIsFirstTimeUser(false);
        setShowLanguageSelector(false);
      } catch (error) {
        console.error("Error selecting language:", error);
      }
    }
  };

  const handleNext = () => {
    if (lessons && currentIndex < (lessons.words?.length ?? 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (lessons && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleLanguageCardClick = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setDay(1);
    setIsFirstTimeUser(false);
  };

  const handleAddLanguage = () => {
    setShowLanguageSelector(true);
  };

  const handleDayClick = async (selectedDay: number) => {
    setDay(selectedDay);
    setCurrentIndex(0);
    const lessonRef = doc(firestore, 'users', user!.uid, 'languages', language, 'lessons', `${selectedDay}`);
    const docSnapshot = await getDoc(lessonRef);
    if (docSnapshot.exists()) {
      const lessonData = docSnapshot.data();
      setLessons(lessonData as { words: string[], sentences: string[] });
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 min-h-screen">
      <LinearProgress 
        variant="determinate" 
        value={lessons ? (currentIndex + 1) / (lessons.words?.length ?? 1) * 100 : 0} 
        sx={{ marginBottom: 2, width: '100%' }}
      />
      {isFirstTimeUser ? (
        <div>
          <Typography variant="h4" className="text-center mb-4 font-semibold">Select a Language</Typography>
          <Button
            onClick={handleAddLanguage}
            variant="contained"
            color="primary"
            className="mb-4 w-full"
          >
            Add Language
          </Button>
          {showLanguageSelector && (
            <div className="space-y-2">
              {popularLanguages.filter(lang => !userLanguages.includes(lang)).map(lang => (
                <Button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  variant="contained"
                  color="primary"
                  className="m-2"
                >
                  {lang}
                </Button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <Typography variant="h4" className="text-center mb-4 font-semibold">Your Languages</Typography>
          <Grid container spacing={2} justifyContent="center">
            {userLanguages.length > 0 && (
              userLanguages.map(lang => (
                <Grid item xs={6} sm={4} md={3} key={lang}>
                  <Card onClick={() => handleLanguageCardClick(lang)} sx={{ cursor: 'pointer' }}>
                    <CardContent>
                      <Typography variant="h6">{lang}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
          <Button
            onClick={handleAddLanguage}
            variant="contained"
            color="primary"
            className="mt-4 w-full"
          >
            Add New Language
          </Button>
          {showLanguageSelector && (
            <div className="space-y-2 mt-2">
              {popularLanguages.filter(lang => !userLanguages.includes(lang)).map(lang => (
                <Button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  variant="contained"
                  color="primary"
                  className="m-2"
                >
                  {lang}
                </Button>
              ))}
            </div>
          )}
          {lessons && (
            <div className="space-y-4 mt-4">
              <Typography variant="h6" className="text-center">Day {day}</Typography>
              <Typography variant="h6">Word: {lessons.words.length > 0 ? lessons.words[currentIndex] : 'N/A'}</Typography>
              <Typography variant="body1">Sentence: {lessons.sentences.length > 0 ? lessons.sentences[currentIndex] : 'N/A'}</Typography>
              <Box display="flex" justifyContent="space-between">
                <Button onClick={handlePrevious} disabled={currentIndex === 0}>Previous</Button>
                <Button onClick={handleNext} disabled={lessons.words.length === 0 || currentIndex === (lessons.words.length - 1)}>Next</Button>
              </Box>
              <Box className="mt-4">
                <Typography variant="subtitle1" className="text-center">Progress</Typography>
                <div className="flex flex-wrap justify-between items-center">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <Typography
                        variant="body2"
                        className={`cursor-pointer ${index + 1 === day ? 'font-semibold' : ''}`}
                        onClick={() => handleDayClick(index + 1)}
                      >
                        Day {index + 1}
                      </Typography>
                      <div className={`w-4 h-4 rounded-full ${index + 1 <= day ? 'bg-blue-600' : 'bg-gray-400'} border-2 border-white`} />
                    </div>
                  ))}
                </div>
              </Box>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Learn;
