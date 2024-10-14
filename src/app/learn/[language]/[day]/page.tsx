'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, firestore } from '@/app/firebase/config';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { Box, Typography, Button, CircularProgress, Snackbar, LinearProgress } from '@mui/material';
// import { Alert } from '@mui/lab';
// import { Fade } from '@mui/material';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import HomeIcon from '@mui/icons-material/Home';

// const Lesson = ({ params }: { params: { language: string; day: string } }) => {
//   const [user] = useAuthState(auth);
//   const [lessonData, setLessonData] = useState<{ words: string[]; sentences: string[] } | null>(null);
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [streakUpdated, setStreakUpdated] = useState(false);
//   const [showSnackbar, setShowSnackbar] = useState(false);
//   const router = useRouter();

//   const { language, day } = params;

//   useEffect(() => {
//     const fetchLesson = async () => {
//       try {
//         const response = await fetch('/api/learn', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ language, day }),
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setLessonData(data);
//         } else {
//           console.error('Failed to fetch lesson data');
//         }
//       } catch (error) {
//         console.error('Error fetching lesson data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLesson();
//   }, [language, day]);

//   const handleNext = async () => {
//     if (!lessonData) return;

//     if (currentWordIndex < (lessonData.words.length ?? 0) - 1) {
//       setCurrentWordIndex(currentWordIndex + 1);
//     } else if (currentSentenceIndex < (lessonData.sentences.length ?? 0) - 1) {
//       setCurrentSentenceIndex(currentSentenceIndex + 1);
//     } else {
//       await completeLesson();
//     }
//   };

//   const completeLesson = async () => {
//     if (!user || !lessonData) return;

//     try {
//         const userRef = doc(firestore, 'users', user.uid);
//         const userDoc = await getDoc(userRef);
//         if (userDoc.exists()) {
//             const userData = userDoc.data();

//             const today = new Date().toISOString().split('T')[0];
//             const lastCompletedDate = userData.lastCompletedDate || '';

//             const isValidDate = (date) => {
//                 return !isNaN(Date.parse(date));
//             };

//             let newStreak = userData.languages?.[language]?.streak || 0;

//             if (!isValidDate(lastCompletedDate)) {
//                 await updateDoc(userRef, {
//                     [`languages.${language}.streak`]: 1,
//                     [`languages.${language}.completedLessons`]: (userData.languages?.[language]?.completedLessons || 0) + 1,
//                     lastCompletedDate: today,
//                 });
//                 setStreakUpdated(true);
//                 setShowSnackbar(true);
//                 return;
//             }

//             if (today === lastCompletedDate) {
//                 return; 
//             } else if (today === new Date(new Date(lastCompletedDate).setDate(new Date(lastCompletedDate).getDate() + 1)).toISOString().split('T')[0]) {
//                 newStreak += 1;
//             } else {
//                 newStreak = 1; 
//             }

//             await updateDoc(userRef, {
//                 [`languages.${language}.streak`]: newStreak,
//                 [`languages.${language}.completedLessons`]: (userData.languages?.[language]?.completedLessons || 0) + 1, 
//                 lastCompletedDate: today,
//             });

//             setStreakUpdated(true);
//             setShowSnackbar(true);
//         }
//     } catch (error) {
//         console.error('Error updating lesson completion:', error);
//     }
// };




//   const handleSnackbarClose = () => {
//     setShowSnackbar(false);
//   };

//   const handleHome = () => {
//     router.push('/');
//   };

//   const handleNextLesson = () => {
//     const nextDay = parseInt(day) + 1;
//     router.push(`/learn/${language}/${nextDay}`);
//   };

//   if (loading) {
//     return (
//       <Box p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const totalSteps: number = (lessonData?.words.length ?? 0) + (lessonData?.sentences.length ?? 0);
//   const currentStep = currentWordIndex + currentSentenceIndex + 1;

//   return (
//     <Box p={4} maxWidth="600px" margin="0 auto" textAlign="center">
//       <Typography variant="h4" mb={4} fontWeight="bold">
//         Lesson for {language} - Day {day}
//       </Typography>

//       <LinearProgress variant="determinate" value={(currentStep / totalSteps) * 100} sx={{ mb: 2 }} />

//       <Fade in={true} timeout={500}>
//         <Box mb={4} p={2} bgcolor="#f9f9f9" borderRadius="8px">
//           <Typography variant="h6" gutterBottom fontWeight="500">Word:</Typography>
//           <Typography variant="body1" color="textSecondary" fontSize="1.2rem">
//             {lessonData && Array.isArray(lessonData.words) && lessonData.words.length > currentWordIndex
//               ? lessonData.words[currentWordIndex]
//               : 'No word available'}
//           </Typography>
//         </Box>
//       </Fade>

//       <Fade in={true} timeout={500}>
//         <Box mb={4} p={2} bgcolor="#f9f9f9" borderRadius="8px">
//           <Typography variant="h6" gutterBottom fontWeight="500">Sentence:</Typography>
//           <Typography variant="body1" color="textSecondary" fontSize="1.2rem">
//             {lessonData && Array.isArray(lessonData.sentences) && lessonData.sentences.length > currentSentenceIndex
//               ? lessonData.sentences[currentSentenceIndex]
//               : 'No sentence available'}
//           </Typography>
//         </Box>
//       </Fade>

//       <Box display="flex" justifyContent="center" gap={2} mt={4}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleNext}
//           disabled={!lessonData || !lessonData.words || !lessonData.sentences}
//           sx={{ px: 4, py: 1.5, transition: 'background-color 0.3s' }}
//           onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#3f51b5')}
//           onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '')}
//         >
//           {(lessonData && currentWordIndex < (lessonData.words.length || 0) - 1) ||
//             (lessonData && currentSentenceIndex < (lessonData.sentences.length || 0) - 1)
//             ? 'Next'
//             : 'Complete Lesson'} <KeyboardArrowRightIcon />
//         </Button>

//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={handleHome}
//           size="large"
//           sx={{ px: 4, py: 1.5 }}
//         >
//           <HomeIcon /> Go to Home
//         </Button>
//       </Box>

//       {currentWordIndex === (lessonData?.words.length ?? 0) - 1 && currentSentenceIndex === (lessonData?.sentences.length ?? 0) - 1 && (
//         <Button
//           variant="contained"
//           color="success"
//           onClick={handleNextLesson}
//           size="large"
//           sx={{ mt: 2, px: 4, py: 1.5 }}
//         >
//           Next Lesson
//         </Button>
//       )}

//       <Snackbar
//         open={showSnackbar}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
//           Congratulations! You've completed the lesson.
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Lesson;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { 
  Box, Typography, Button, CircularProgress, Snackbar, LinearProgress, 
  Card, CardContent, Container, Grid, IconButton, Tooltip, Paper,
  useTheme, useMediaQuery
} from '@mui/material';
import { Alert, AlertTitle } from '@mui/lab';
import { Fade, Zoom, Grow } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Lesson = ({ params }: { params: { language: string; day: string } }) => {
  const [user] = useAuthState(auth);
  const [lessonData, setLessonData] = useState<{ words: string[]; sentences: string[] } | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [streakUpdated, setStreakUpdated] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [streak, setStreak] = useState(0);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { language, day } = params;

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch('/api/learn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language, day }),
        });

        if (response.ok) {
          const data = await response.json();
          setLessonData(data);
        } else {
          console.error('Failed to fetch lesson data');
        }
      } catch (error) {
        console.error('Error fetching lesson data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
    fetchUserStreak();
  }, [language, day, user]);

  const fetchUserStreak = async () => {
    if (!user) return;
    try {
      const userRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setStreak(userData.languages?.[language]?.streak || 0);
      }
    } catch (error) {
      console.error('Error fetching user streak:', error);
    }
  };

  const handleNext = async () => {
    if (!lessonData) return;

    if (currentWordIndex < (lessonData.words.length ?? 0) - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else if (currentSentenceIndex < (lessonData.sentences.length ?? 0) - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
    } else {
      await completeLesson();
    }
  };

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
    } else if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  const completeLesson = async () => {
    if (!user || !lessonData) return;

    try {
      const userRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const today = new Date().toISOString().split('T')[0];
        const lastCompletedDate = userData.lastCompletedDate || '';
        let newStreak = userData.languages?.[language]?.streak || 0;

        if (today !== lastCompletedDate) {
          if (today === new Date(new Date(lastCompletedDate).setDate(new Date(lastCompletedDate).getDate() + 1)).toISOString().split('T')[0]) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }

          await updateDoc(userRef, {
            [`languages.${language}.streak`]: newStreak,
            [`languages.${language}.completedLessons`]: (userData.languages?.[language]?.completedLessons || 0) + 1,
            lastCompletedDate: today,
          });

          setStreak(newStreak);
          setStreakUpdated(true);
          setShowSnackbar(true);
          setShowStreak(true);
        }
      }
    } catch (error) {
      console.error('Error updating lesson completion:', error);
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleHome = () => {
    router.push('/');
  };

  const handleNextLesson = () => {
    const nextDay = parseInt(day) + 1;
    router.push(`/learn/${language}/${nextDay}`);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'spanish' ? 'es-ES' : 'en-US'; // Add more languages as needed
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const totalSteps: number = (lessonData?.words?.length ?? 0) + (lessonData?.sentences?.length ?? 0);
  const currentStep = currentWordIndex + currentSentenceIndex + 1;

  return (
    <Container maxWidth="md" style={{height : 1000}}>
      <Box py={4}>
        <Typography variant="h3" mb={4} fontWeight="bold" textAlign="center" color="primary">
          {language.charAt(0).toUpperCase() + language.slice(1)} - Day {day}
        </Typography>

        <Paper elevation={3} sx={{ p: 2, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body1" sx={{ mr: 2, mb: isMobile ? 2 : 0 }}>Progress:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mb: isMobile ? 2 : 0 }}>
            <LinearProgress 
              variant="determinate" 
              value={(currentStep / totalSteps) * 100} 
              sx={{ flexGrow: 1, height: 10, borderRadius: 5 }} 
            />
            <Typography variant="body2" sx={{ ml: 2, minWidth: 65 }}>
              {currentStep}/{totalSteps}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {Math.round((currentStep / totalSteps) * 100)}%
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={500}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="h5" gutterBottom fontWeight="500" color="primary">
                    Word of the Day
                  </Typography>
                  <Typography variant="h4" color="text.secondary" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {lessonData && Array.isArray(lessonData.words) && lessonData.words.length > currentWordIndex
                      ? lessonData.words[currentWordIndex]
                      : 'No word available'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <IconButton 
                      onClick={() => speakText(lessonData?.words[currentWordIndex])}
                      color="primary"
                      aria-label="Pronounce word"
                    >
                      <VolumeUpIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={500}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="h5" gutterBottom fontWeight="500" color="primary">
                    Example Sentence
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontSize="1.2rem" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {lessonData && Array.isArray(lessonData.sentences) && lessonData.sentences.length > currentSentenceIndex
                      ? lessonData.sentences[currentSentenceIndex]
                      : 'No sentence available'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <IconButton 
                      onClick={() => speakText(lessonData?.sentences[currentSentenceIndex])}
                      color="primary"
                      aria-label="Pronounce sentence"
                    >
                      <VolumeUpIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center" gap={2} mt={6} flexWrap="wrap">
          <Zoom in={true} style={{ transitionDelay: '300ms' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handlePrevious}
              disabled={currentWordIndex === 0 && currentSentenceIndex === 0}
              sx={{ px: 3, py: 1.5, fontSize: '1rem' }}
              startIcon={<KeyboardArrowLeftIcon />}
            >
              Previous
            </Button>
          </Zoom>

          <Zoom in={true} style={{ transitionDelay: '500ms' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!lessonData || !lessonData.words || !lessonData.sentences}
              sx={{ px: 3, py: 1.5, fontSize: '1rem' }}
              endIcon={<KeyboardArrowRightIcon />}
            >
              {(lessonData && currentWordIndex < (lessonData?.words?.length || 0) - 1) ||
                (lessonData && currentSentenceIndex < (lessonData?.sentences?.length || 0) - 1)
                ? 'Next'
                : 'Complete Lesson'}
            </Button>
          </Zoom>

          <Zoom in={true} style={{ transitionDelay: '700ms' }}>
            <Tooltip title="Return to dashboard">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleHome}
                sx={{ px: 3, py: 1.5, fontSize: '1rem' }}
                startIcon={<HomeIcon />}
              >
                Home
              </Button>
            </Tooltip>
          </Zoom>
        </Box>

        {currentWordIndex === (lessonData?.words?.length ?? 0) - 1 && 
         currentSentenceIndex === (lessonData?.sentences?.length ?? 0) - 1 && (
          <Box textAlign="center" mt={4}>
            <Zoom in={true} style={{ transitionDelay: '900ms' }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleNextLesson}
                sx={{ px: 3, py: 1.5, fontSize: '1rem' }}
                startIcon={<SchoolIcon />}
              >
                Next Lesson
              </Button>
            </Zoom>
          </Box>
        )}

        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            <AlertTitle>Lesson Completed!</AlertTitle>
            Great job! You've finished today's lesson.
          </Alert>
        </Snackbar>

        <Grow in={showStreak}>
          <Paper 
            elevation={3} 
            sx={{ 
              position: 'fixed', 
              bottom: 20, 
              right: 20, 
              p: 2, 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: 'success.light',
              borderRadius: '20px'
            }}
          >
            <EmojiEventsIcon sx={{ mr: 1, color: 'success.dark' }} />
            <Typography variant="h6" color="success.dark">
              {streak} Day Streak!
            </Typography>
          </Paper>
        </Grow>
      </Box>
    </Container>
  );
};

export default Lesson;