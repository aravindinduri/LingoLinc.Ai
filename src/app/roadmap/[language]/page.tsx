'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Button, Typography, Box, Container, CircularProgress, Tooltip } from '@mui/material';
import { CheckCircle, Lock } from '@mui/icons-material';

interface RoadMapProps {
  params: {
    language: string;
  };
}

const RoadMap: React.FC<RoadMapProps> = ({ params }) => {
  const [user] = useAuthState(auth);
  const [completedDays, setCompletedDays] = useState<number>(0);
  const [language, setLanguage] = useState<string>(params.language);
  const [loading, setLoading] = useState<boolean>(true);
  const [lessons, setLessons] = useState<any>(null); 
  const router = useRouter();

  useEffect(() => {
    const fetchCompletedDays = async () => {
      if (user && language) {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCompletedDays(userData.languages?.[language] || 0);
        }
      }
    };

    fetchCompletedDays();
  }, [user, language]);

  useEffect(() => {
    const fetchLessons = async () => {
      if (language) {
        const response = await fetch('/api/learn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language, day: 1 }),
        });

        if (response.ok) {
          const data = await response.json();
          setLessons(data);
        } else {
          console.error('Failed to fetch lessons');
        }
        setLoading(false);  // Stop loading once lessons are fetched
      }
    };

    fetchLessons();
  }, [language]);

  const handleLessonClick = (day: number) => {
    router.push(`/learn/${language}/${day}`);
  };

  return (
    <Container>
      <Typography variant="h4" className="text-center mb-4">
        Roadmap for {language}
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
        {loading ? (
          <CircularProgress />
        ) : (
          <div className="roadmap">
            {Array.from({ length: 30 }, (_, index) => (
              <div
                key={index + 1}
                className={`roadmap-step ${index + 1 <= completedDays ? 'completed' : 'locked'}`}
                onClick={() => handleLessonClick(index + 1)}
              >
                <Tooltip title={index + 1 <= completedDays ? 'Completed' : 'Locked'}>
                  <Typography variant="body2">
                    Day {index + 1}
                  </Typography>
                </Tooltip>
                {index + 1 <= completedDays ? <CheckCircle /> : <Lock />}
              </div>
            ))}
          </div>
        )}
      </Box>
      <style jsx>{`
        .roadmap {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .roadmap-step {
          background: #1976d2;
          color: white;
          padding: 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: background 0.3s ease;
        }
        .roadmap-step.completed {
          background: #4caf50;
        }
        .roadmap-step.locked {
          background: #e0e0e0;
          color: #9e9e9e;
        }
        .roadmap-step:hover {
          background: #1565c0;
        }
      `}</style>
    </Container>
  );
};

export default RoadMap;
