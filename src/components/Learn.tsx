'use client';

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
  const [userLanguages, setUserLanguages] = useState<string[]>([]);
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
          const userData = userDoc.data() as { languages: string[]; language: string; day: number };
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

  const handleGoToRoadmap = (lang: string) => {
    setLanguage(lang);
    window.location.href = `/roadmap/${lang}`;
  };

  return (
    <div className="p-4" style={{ position: 'relative', overflow: 'hidden', height: '100vh', background: 'linear-gradient(to right, #6a82fb, #fc5c7d)' }}>
      <Typography variant="h4" className="text-center mb-6" style={{ color: theme.palette.primary.main }}>
        Learn
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <div className="space-y-4 mb-4">
            {userLanguages.map((lang, index) => (
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
                backgroundColor: theme.palette.common.white,
                color: theme.palette.text.primary,
                padding: '12px 16px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              {popularLanguages.map((lang) => (
                <MenuItem key={lang} value={lang} style={{ backgroundColor: theme.palette.common.white, color: theme.palette.text.primary }}>
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
