'use client';

import React from 'react';
import PathStep from './PathStep';
import { Typography } from '@mui/material';

const LearnPage: React.FC = () => {
  const [language, setLanguage] = React.useState('German'); // Example language
  const [day, setDay] = React.useState(1); // Example day

  // Simulated completed days
  const completedDays = [1, 2, 3];

  return (
    <div className="p-4">
      <Typography variant="h5" className="text-center mb-4">Learning Path for {language}</Typography>
      <div className="flex flex-col items-center">
        {[1, 2, 3, 4, 5].map((step) => (
          <PathStep
            key={step}
            completed={completedDays.includes(step)}
            onClick={() => {
              // Navigate to the lesson page for the selected day
              if (completedDays.includes(step)) {
                window.location.href = `/learn/${language}/${step}`;
              }
            }}
          >
            Day {step}
          </PathStep>
        ))}
      </div>
    </div>
  );
};

export default LearnPage;
