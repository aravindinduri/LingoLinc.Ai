'use client';

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  Button,
  Typography,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Box,
} from '@mui/material';
import { Add } from '@mui/icons-material';

const Learn: React.FC = () => {
  const [user] = useAuthState(auth);
  const [userLanguages, setUserLanguages] = useState<{ name: string, daysCompleted: number }[]>([]);
  const [language, setLanguage] = useState<string>('');
  const [showLanguageSelector, setShowLanguageSelector] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchUserLanguages = async () => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserLanguages(userData.languages || []);
          setLanguage(userData.language || '');
        }
      }
    };

    fetchUserLanguages();
  }, [user]);

  const handleLanguageSelect = async (selectedLanguage: string) => {
    if (user) {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        // Find the selected language's daysCompleted
        const languageData = userLanguages.find(lang => lang.name === selectedLanguage);
        const daysCompleted = languageData ? languageData.daysCompleted : 1;

        await setDoc(userRef, {
          language: selectedLanguage,  // Set the current language
          day: daysCompleted + 1  // Move to the next day
        }, { merge: true });

        setLanguage(selectedLanguage);
      } catch (error) {
        console.error("Error selecting language:", error);
      }
    }
  };

  const handleAddLanguage = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseLanguageSelector = () => {
    setShowLanguageSelector(false);
  };

  return (
    <div className="p-4">
      <Typography variant="h5" className="text-center mb-4">Learn</Typography>
      {userLanguages.length > 0 && (
        <div className="space-y-4">
          {userLanguages.map((lang, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Typography variant="h6">{lang.name}</Typography>
                <Typography variant="body2">Days Completed: {lang.daysCompleted}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => setLanguage(lang.name)}
                  variant="contained"
                  color="primary"
                >
                  View Progress
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      )}
      <Button
        onClick={handleAddLanguage}
        variant="contained"
        color="secondary"
        startIcon={<Add />}
        sx={{ mt: 2 }}
      >
        Add Language
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseLanguageSelector}
      >
        {['Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese', 'Korean', 'Portuguese', 'Russian', 'Arabic', 'Turkish', 'Swedish', 'Norwegian', 'Danish', 'Finnish'].map((lang, index) => (
          <MenuItem key={index} onClick={() => handleLanguageSelect(lang)}>
            {lang}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Learn;
