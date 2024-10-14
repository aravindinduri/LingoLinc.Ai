'use client';

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Learn: React.FC = () => {
  const [user] = useAuthState(auth);
  const [userLanguages, setUserLanguages] = useState<any>({});
  const [language, setLanguage] = useState<string>('');
  const [day, setDay] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const theme = useTheme();

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
          const languages = userData.languages || {};
          setUserLanguages(languages);
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
        const userDoc = await getDoc(userRef);
        const userData = userDoc.exists() ? userDoc.data() : { languages: {} };

        const updatedLanguages = {
          ...userData.languages,
          [selectedLanguage]: { completedLessons: 0, lastCompletedDate: null },
        };

        await setDoc(userRef, {
          languages: updatedLanguages,
          language: selectedLanguage,
          day: 1,
        }, { merge: true });

        setUserLanguages(updatedLanguages);
        setLanguage(selectedLanguage);
        setDay(1);
        setSelectedLanguage('');
      } catch (error) {
        console.error("Error selecting language:", error);
      }
    }
  };

  const handleGoToRoadmap = (lang: string) => {
    setLanguage(lang);
    window.location.href = `/roadmap/${lang}`;
  };

  // Function to complete a lesson automatically
  const completeLesson = async () => {
    if (user && language) {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.exists() ? userDoc.data() : { languages: {} };

        const currentLangData = userData.languages[language] || { completedLessons: 0, lastCompletedDate: null };
        const updatedLangData = {
          ...currentLangData,
          completedLessons: currentLangData.completedLessons + 1,  // Increment lessons
          lastCompletedDate: serverTimestamp(),  // Update timestamp
        };

        await updateDoc(userRef, {
          [`languages.${language}`]: updatedLangData,
        });

        setUserLanguages((prevState: any) => ({
          ...prevState,
          [language]: updatedLangData,
        }));

      } catch (error) {
        console.error("Error completing lesson:", error);
      }
    }
  };

  return (
    <div className="p-4" style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
      <Typography variant="h4" className="text-center mb-6" style={{ color: theme.palette.primary.main }}>
        Learn
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <div className="space-y-4 mb-4">
            {Object.keys(userLanguages).map((lang, index) => (
              <Button
                key={index}
                onClick={() => handleGoToRoadmap(lang)}
                variant="contained"
                color={lang === language ? 'primary' : 'secondary'}
                style={{
                  backgroundColor: lang === language ? theme.palette.primary.main : theme.palette.secondary.main,
                  color: theme.palette.common.white,
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  textTransform: 'none',
                }}
              >
                {lang}
              </Button>
            ))}
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth className="mb-4">
            <InputLabel
              style={{
                color: theme.palette.text.primary,
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Select Language
            </InputLabel>
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              label="Select Language"
              style={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                padding: '12px 16px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              {popularLanguages.map((lang) => (
                <MenuItem
                  key={lang}
                  value={lang}
                  style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}
                >
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
            className="mb-4"
            style={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.common.white,
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              textTransform: 'none',
            }}
          >
            Add Language
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Learn;
