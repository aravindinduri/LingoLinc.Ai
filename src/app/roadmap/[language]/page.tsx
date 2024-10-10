'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Typography, Box, Container, CircularProgress, Tooltip } from '@mui/material';
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCompletedDays = async () => {
      try {
        if (user && language) {
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCompletedDays(userData.languages?.[language] || 0);
          } else {
            setError('User data not found.');
          }
        }
      } catch (error) {
        setError('Failed to fetch completed days.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedDays();
  }, [user, language]);

  const handleLessonClick = (day: number) => {
    if (day <= completedDays || day === 1) {  // Allow clicking on Day 1 regardless of completed days
      router.push(`/learn/${language}/${day}`);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
          <CircularProgress />
          <Typography variant="body2" className="mt-2">
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" className="text-center mb-4">
        Roadmap for {language}
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
        <div className="roadmap">
          {Array.from({ length: 30 }, (_, index) => (
            <div
              key={index + 1}
              className={`roadmap-step ${index + 1 <= completedDays || index + 1 === 1 ? 'completed' : 'locked'}`}
              onClick={() => handleLessonClick(index + 1)}
            >
              <Tooltip title={index + 1 <= completedDays || index + 1 === 1 ? 'Completed' : 'Locked'}>
                <div className="flex items-center space-x-2">
                  <Typography variant="body2">
                    Day {index + 1}
                  </Typography>
                  {index + 1 <= completedDays || index + 1 === 1 ? <CheckCircle /> : <Lock />}
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
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
          width: 100%;
          max-width: 200px;
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
