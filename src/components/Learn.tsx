'use client';

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

const Learn: React.FC = () => {
  const [user] = useAuthState(auth);
  const [userLanguages, setUserLanguages] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>('');
  const [day, setDay] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const popularLanguages = [
    'Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese', 'Korean', 'Portuguese',
    'Russian', 'Arabic', 'Turkish', 'Swedish', 'Norwegian', 'Danish', 'Finnish'
  ];

  useEffect(() => {
    const fetchUserLanguages = async () => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserLanguages(userData.languages || []);
          setLanguage(userData.language || '');
          setDay(userData.day || 1);
        }
      }
    };

    fetchUserLanguages();
  }, [user]);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setSelectedLanguage(event.target.value);
  };

  const handleAddLanguage = async () => {
    if (user && selectedLanguage) {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, { 
          languages: [...userLanguages, selectedLanguage],
          language: selectedLanguage,  // Set the current language
          day: 1
        }, { merge: true });
        setUserLanguages(prevLanguages => [...prevLanguages, selectedLanguage]);
        setLanguage(selectedLanguage);
        setDay(1);
        setSelectedLanguage('');  // Clear the selected language
      } catch (error) {
        console.error("Error selecting language:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <Typography variant="h5" className="text-center mb-4">Learn</Typography>
      {userLanguages.length > 0 && (
        <div className="space-y-4 mb-4">
          {userLanguages.map((lang, index) => (
            <Button
              key={index}
              onClick={() => {
                setLanguage(lang);
                setDay(1);
              }}
              variant="contained"
              color="primary"
            >
              {lang}
            </Button>
          ))}
        </div>
      )}
      <FormControl fullWidth className="mb-4">
        <InputLabel>Select Language</InputLabel>
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          label="Select Language"
        >
          {popularLanguages.map((lang) => (
            <MenuItem key={lang} value={lang}>
              {lang}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        onClick={handleAddLanguage}
        variant="contained"
        color="secondary"
        disabled={!selectedLanguage}
      >
        Add Language
      </Button>
      {language && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.href = `/roadmap/${language}`}
          className="mt-4"
        >
          Go to Roadmap for {language}
        </Button>
      )}
    </div>
  );
};

export default Learn;
