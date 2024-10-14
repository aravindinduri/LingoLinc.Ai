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
  const [completedLessons, setCompletedLessons] = useState<number>(0);
  const [language, setLanguage] = useState<string>(params.language);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCompletedLessons = async () => {
      try {
        if (user && language) {
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const languageData = userData.languages?.[language];
            if (languageData) {
              setCompletedLessons(languageData.completedLessons || 0);
            } else {
              setError(`No data found for language: ${language}`);
            }
          } else {
            setError('User data not found.');
          }
        }
      } catch (error) {
        setError('Failed to fetch completed lessons.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedLessons();
  }, [user, language]);

  const handleLessonClick = (day: number) => {
    if (day <= completedLessons + 1) {
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
      <Box className="roadmap-container">
        <div className="roadmap">
          {Array.from({ length: 30 }, (_, index) => (
            <Tooltip
              key={index + 1}
              title={index + 1 <= completedLessons ? 'Completed' : index + 1 === completedLessons + 1 ? 'Next Lesson' : 'Locked'}
            >
              <div
                className={`roadmap-step ${index + 1 <= completedLessons || index + 1 === completedLessons + 1 ? 'completed' : 'locked'}`}
                onClick={() => handleLessonClick(index + 1)}
              >
                <div className="step-content">
                  <Typography variant="body2">
                    Day {index + 1}
                  </Typography>
                  {index + 1 <= completedLessons ? <CheckCircle /> : index + 1 === completedLessons + 1 ? <CheckCircle color="primary" /> : <Lock />}
                </div>
              </div>
            </Tooltip>
          ))}
        </div>
      </Box>
      <style jsx>{`
        .roadmap-container {
          display: flex;
          justify-content: center;
          padding: 20px 0;
        }
        .roadmap {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding: 20px;
        }
        .roadmap::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 2px;
          background: #e0e0e0;
          transform: translateX(-50%);
          z-index: 0;
        }
        .roadmap-step {
          background: #1976d2;
          color: white;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
          margin: 20px 0;
        }
        .roadmap-step::before,
        .roadmap-step::after {
          content: '';
          position: absolute;
          background: #e0e0e0;
          z-index: -1;
        }
        .roadmap-step::before {
          width: 100px;
          height: 2px;
          top: 50%;
        }
        .roadmap-step::after {
          width: 2px;
          height: 100px;
          left: 50%;
        }
        .roadmap-step:nth-child(odd) {
          margin-right: 60px;
        }
        .roadmap-step:nth-child(even) {
          margin-left: 60px;
        }
        .roadmap-step:nth-child(odd)::before {
          left: 100%;
          transform: translateY(-50%);
          border-top-right-radius: 50px;
          border-bottom-right-radius: 50px;
        }
        .roadmap-step:nth-child(even)::before {
          right: 100%;
          transform: translateY(-50%);
          border-top-left-radius: 50px;
          border-bottom-left-radius: 50px;
        }
        .roadmap-step:nth-child(odd)::after {
          top: -50px;
          transform: translateX(-50%);
          border-top-left-radius: 50px;
          border-top-right-radius: 50px;
        }
        .roadmap-step:not(:last-child):nth-child(even)::after {
          bottom: -50px;
          transform: translateX(-50%);
          border-bottom-left-radius: 50px;
          border-bottom-right-radius: 50px;
        }
        .roadmap-step.completed {
          background: #4caf50;
        }
        .roadmap-step.locked {
          background: #e0e0e0;
          color: #000;
          cursor: not-allowed;
        }
        .roadmap-step:hover {
          transform: scale(1.1);
        }
        .step-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
      `}</style>
    </Container>
  );
};

export default RoadMap;