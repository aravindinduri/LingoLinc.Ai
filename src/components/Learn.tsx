'use client';

// import React, { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, firestore } from '@/app/firebase/config';
// import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
// import {
//   Button,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   SelectChangeEvent,
//   Grid,
// } from '@mui/material';
// import { useTheme } from '@mui/material/styles';

// const Learn: React.FC = () => {
//   const [user] = useAuthState(auth);
//   const [userLanguages, setUserLanguages] = useState<any>({});
//   const [language, setLanguage] = useState<string>('');
//   const [day, setDay] = useState<number>(1);
//   const [selectedLanguage, setSelectedLanguage] = useState<string>('');
//   const theme = useTheme();

//   const popularLanguages = [
//     'Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese', 'Korean', 'Portuguese',
//     'Russian', 'Arabic', 'Turkish', 'Swedish', 'Norwegian', 'Danish', 'Finnish'
//   ];

//   useEffect(() => {
//     const fetchUserLanguages = async () => {
//       if (user) {
//         const userRef = doc(firestore, 'users', user.uid);
//         const userDoc = await getDoc(userRef);

//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const languages = userData.languages || {};
//           setUserLanguages(languages);
//           setLanguage(userData.language || '');
//           setDay(userData.day || 1);
//         }
//       }
//     };
//     fetchUserLanguages();
//   }, [user]);

//   const handleLanguageChange = (event: SelectChangeEvent<string>) => {
//     setSelectedLanguage(event.target.value);
//   };

//   const handleAddLanguage = async () => {
//     if (user && selectedLanguage) {
//       try {
//         const userRef = doc(firestore, 'users', user.uid);
//         const userDoc = await getDoc(userRef);
//         const userData = userDoc.exists() ? userDoc.data() : { languages: {} };

//         const updatedLanguages = {
//           ...userData.languages,
//           [selectedLanguage]: { completedLessons: 0, lastCompletedDate: null },
//         };

//         await setDoc(userRef, {
//           languages: updatedLanguages,
//           language: selectedLanguage,
//           day: 1,
//         }, { merge: true });

//         setUserLanguages(updatedLanguages);
//         setLanguage(selectedLanguage);
//         setDay(1);
//         setSelectedLanguage('');
//       } catch (error) {
//         console.error("Error selecting language:", error);
//       }
//     }
//   };

  // const handleGoToRoadmap = (lang: string) => {
  //   setLanguage(lang);
  //   window.location.href = `/roadmap/${lang}`;
  // };

//   // Function to complete a lesson automatically
//   const completeLesson = async () => {
//     if (user && language) {
//       try {
//         const userRef = doc(firestore, 'users', user.uid);
//         const userDoc = await getDoc(userRef);
//         const userData = userDoc.exists() ? userDoc.data() : { languages: {} };

//         const currentLangData = userData.languages[language] || { completedLessons: 0, lastCompletedDate: null };
//         const updatedLangData = {
//           ...currentLangData,
//           completedLessons: currentLangData.completedLessons + 1,  
//           lastCompletedDate: serverTimestamp(), 
//         };

//         await updateDoc(userRef, {
//           [`languages.${language}`]: updatedLangData,
//         });

//         setUserLanguages((prevState: any) => ({
//           ...prevState,
//           [language]: updatedLangData,
//         }));

//       } catch (error) {
//         console.error("Error completing lesson:", error);
//       }
//     }
//   };

//   return (
//     <div className="p-4" style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
//       <Typography variant="h4" className="text-center mb-6" style={{ color: theme.palette.primary.main }}>
//         Learn
//       </Typography>
//       <Grid container spacing={4}>
//         <Grid item xs={12} md={6}>
//           <div className="space-y-4 mb-4">
//             {Object.keys(userLanguages).map((lang, index) => (
//               <Button
//                 key={index}
//                 onClick={() => handleGoToRoadmap(lang)}
//                 variant="contained"
//                 color={lang === language ? 'primary' : 'secondary'}
//                 style={{
//                   backgroundColor: lang === language ? theme.palette.primary.main : theme.palette.secondary.main,
//                   color: theme.palette.common.white,
//                   padding: '12px 24px',
//                   fontSize: '16px',
//                   fontWeight: 'bold',
//                   borderRadius: '8px',
//                   textTransform: 'none',
//                 }}
//               >
//                 {lang}
//               </Button>
//             ))}
//           </div>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <FormControl fullWidth className="mb-4">
//             <InputLabel
//               style={{
//                 color: theme.palette.text.primary,
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//               }}
//             >
//               Select Language
//             </InputLabel>
//             <Select
//               value={selectedLanguage}
//               onChange={handleLanguageChange}
//               label="Select Language"
//               style={{
//                 backgroundColor: theme.palette.background.paper,
//                 color: theme.palette.text.primary,
//                 padding: '12px 16px',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 borderRadius: '8px',
//                 textTransform: 'none',
//               }}
//             >
//               {popularLanguages.map((lang) => (
//                 <MenuItem
//                   key={lang}
//                   value={lang}
//                   style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}
//                 >
//                   {lang}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <Button
//             onClick={handleAddLanguage}
//             variant="contained"
//             color="secondary"
//             disabled={!selectedLanguage}
//             className="mb-4"
//             style={{
//               backgroundColor: theme.palette.secondary.main,
//               color: theme.palette.common.white,
//               padding: '12px 24px',
//               fontSize: '16px',
//               fontWeight: 'bold',
//               borderRadius: '8px',
//               textTransform: 'none',
//             }}
//           >
//             Add Language
//           </Button>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default Learn;


import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/config';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ChevronDown, Plus, BookOpen } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

const Learn = () => {
  const [user] = useAuthState(auth);
  const [userLanguages, setUserLanguages] = useState({});
  const [language, setLanguage] = useState('');
  const [day, setDay] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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
          setUserLanguages(userData.languages || {});
          setLanguage(userData.language || '');
          setDay(userData.day || 1);
        }
      }
    };
    fetchUserLanguages();
  }, [user]);

  const handleLanguageChange = (lang : string) => {
    setSelectedLanguage(lang);
    setIsDropdownOpen(false);
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
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
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
    <div className="p-4 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-100"></h1>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 text-blue-200">Your Languages</h2>
          {Object.keys(userLanguages).map((lang) => (
            <button
              key={lang}
              onClick={() => handleGoToRoadmap(lang)}
              className={`w-full py-3 px-6 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${
                lang === language
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              {lang}
              <BookOpen className="inline-block ml-2 w-5 h-5" />
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 text-blue-200">Add a New Language</h2>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full py-3 px-6 text-lg font-medium bg-white text-gray-800 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300 flex justify-between items-center"
            >
              {selectedLanguage || 'Select a Language'}
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {popularLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className="w-full py-2 px-4 text-left hover:bg-gray-100 transition-colors duration-200"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleAddLanguage}
            disabled={!selectedLanguage}
            className={`w-full py-3 px-6 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
              selectedLanguage
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add Language
            <Plus className="inline-block ml-2 w-5 h-5" />
          </button>
        </div>
      </div>

      {showAlert && (
        <div className="fixed bottom-4 right-4 z-50">
          {/* <Alert>
            <AlertDescription>
              New language added successfully!
            </AlertDescription>
          </Alert> */}
        </div>
      )}
    </div>
  );
};

export default Learn;