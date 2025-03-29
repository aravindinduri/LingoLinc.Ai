'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Typography, Box, Container, CircularProgress, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

interface RoadMapProps {
  params: {
    language: string;
  };
}

const TOTAL_LESSONS = 10;

// Helper function: Create a stepped, zigzag path connecting points.
const createZigzagPath = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    // Draw a horizontal line to the new point's x coordinate, then a vertical line to the new point's y.
    d += ` H ${points[i].x} V ${points[i].y}`;
  }
  return d;
};

const RoadMap: React.FC<RoadMapProps> = ({ params }) => {
  const [user] = useAuthState(auth);
  const [completedLessons, setCompletedLessons] = useState<number>(0);
  const [language] = useState<string>(params.language);
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
          <CircularProgress color="inherit" />
          <Typography variant="body2" sx={{ mt: 2, color: '#ccc' }}>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
          <Typography variant="body2" color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  // Increase vertical spacing by using a larger SVG viewBox.
  // ViewBox height increased to 150 (from 100).
  const viewBoxHeight = 150;
  const verticalMargin = 5;
  const verticalInterval = (viewBoxHeight - 2 * verticalMargin) / (TOTAL_LESSONS - 1);
  const points = Array.from({ length: TOTAL_LESSONS }, (_, index) => {
    const lessonNumber = index + 1;
    // Alternate x position: odd nodes left (30) and even nodes right (70)
    const x = lessonNumber % 2 === 0 ? 70 : 30;
    const y = verticalMargin + index * verticalInterval;
    return { x, y };
  });

  // Generate the stepped, zigzag path from computed points.
  const pathD = createZigzagPath(points);

  // Determine current lesson and avatar position.
  const currentLesson = completedLessons + 1 > TOTAL_LESSONS ? TOTAL_LESSONS : completedLessons + 1;
  const currentPoint = points[currentLesson - 1];
  // Offset the avatar slightly so it appears above the node.
  const avatarOffsetY = -5;

  return (
    <Container disableGutters maxWidth={false}>
      <Box
        height="100vh"
        position="relative"
        overflow="hidden"
        sx={{ background: 'linear-gradient(to bottom, #121212, #000)' }}
      >
        <Typography variant="h4" align="center" sx={{ pt: 2, color: '#fff', zIndex: 2, position: 'relative' }}>
          Learning Path for {language}
        </Typography>
        <svg viewBox={`0 0 100 ${viewBoxHeight}`} style={{ width: '100%', height: '90vh', display: 'block', margin: 'auto' }}>
          {/* Stepped Zigzag Path */}
          <path d={pathD} fill="none" stroke="#555" strokeWidth="1.8" strokeDasharray="4,2" />
          
          {/* Lesson Nodes */}
          {points.map((point, index) => {
            const lessonNumber = index + 1;
            const isAccessible = lessonNumber <= completedLessons + 1;
            const fillColor =
              lessonNumber <= completedLessons
                ? '#4caf50'
                : lessonNumber === completedLessons + 1
                ? '#1976d2'
                : '#555';
            return (
              <Tooltip
                key={lessonNumber}
                title={
                  lessonNumber <= completedLessons
                    ? 'Completed'
                    : lessonNumber === completedLessons + 1
                    ? 'Next Lesson'
                    : 'Locked'
                }
              >
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill={fillColor}
                  stroke="#fff"
                  strokeWidth="1.5"
                  style={{
                    cursor: isAccessible ? 'pointer' : 'not-allowed',
                    filter: isAccessible ? 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' : 'none'
                  }}
                  whileHover={isAccessible ? { scale: 1.4, filter: 'drop-shadow(0 0 8px rgba(255,255,255,1))' } : {}}
                  whileTap={isAccessible ? { scale: 0.9 } : {}}
                  onClick={() => handleLessonClick(lessonNumber)}
                />
              </Tooltip>
            );
          })}
        </svg>

        {/* Animated Character Avatar */}
        <motion.div
          className="avatar"
          initial={{ x: 0, y: 0 }}
          animate={{ x: currentPoint.x, y: currentPoint.y + avatarOffsetY }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          style={{ position: 'absolute', fontSize: '2.5rem' }}
        >
          🐶
        </motion.div>

        <style jsx>{`
          .avatar {
            transform: translate(-50%, -50%);
          }
        `}</style>
      </Box>
    </Container>
  );
};

export default RoadMap;
