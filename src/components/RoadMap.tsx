// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Box, Button, Typography } from '@mui/material';
// import  PathStep  from './PathStep'; 

// interface RoadMapProps {
//   language: string;
//   days: number;
// }

// const RoadMap: React.FC<RoadMapProps> = ({ language, days }) => {
//   const router = useRouter();
//   const [completedDays, setCompletedDays] = useState<{ [key: string]: number }>({});
//   const [currentDay, setCurrentDay] = useState<number>(1);

//   useEffect(() => {
//     // Fetch completed days data
//     const fetchCompletedDays = async () => {
//       // Fetch data from an API or Firestore
//       const response = await fetch('/api/getCompletedDays', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ language }),
//       });
//       const data = await response.json();
//       setCompletedDays(data);
//       setCurrentDay(data[language] || 1);  
//     };

//     fetchCompletedDays();
//   }, [language]);

//   const handleStepClick = (day: number) => {
//     router.push(`/learn/${language}/${day}`);
//   };

//   return (
//     <div className="p-4">
//       <Typography variant="h5" className="text-center mb-4">
//         RoadMap for {language}
//       </Typography>
//       <div className="flex flex-col items-center">
//         {[...Array(days).keys()].map(day => (
//           <Box key={day} display="flex" flexDirection="column" alignItems="center">
//             <PathStep
//               completed={(day + 1) <= completedDays[language]}
//               onClick={() => handleStepClick(day + 1)}
//             >
//               Day {day + 1}
//             </PathStep>
//             {day < days - 1 && (
//               <div className="path-line" />
//             )}
//           </Box>
//         ))}
//       </div>
//     </div>
//   );
// };

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Box, Typography } from '@mui/material';
// import PathStep from './PathStep'; 

// interface RoadMapProps {
//   language: string;
//   days: number;
// }

// const RoadMap: React.FC<RoadMapProps> = ({ language, days }) => {
//   const router = useRouter();
//   const [completedDays, setCompletedDays] = useState<{ [key: string]: number }>({});
//   const [currentDay, setCurrentDay] = useState<number>(1);

//   useEffect(() => {
//     const fetchCompletedDays = async () => {
//       try {
//         const response = await fetch('/api/getCompletedDays', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ language }),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch completed days');
//         }

//         const data = await response.json();
//         setCompletedDays(data);
//         setCurrentDay(data[language] || 1);
//       } catch (error) {
//         console.error('Error fetching completed days:', error);
//         // Handle error appropriately (e.g., show an alert)
//       }
//     };

//     fetchCompletedDays();
//   }, [language]);

//   const handleStepClick = (day: number) => {
//     router.push(`/learn/${language}/${day}`);
//   };

//   return (
//     <div className="p-4">
//       <Typography variant="h5" className="text-center mb-4">
//         RoadMap for {language}
//       </Typography>
//       <div className="flex flex-col items-center">
//         {[...Array(days).keys()].map(day => (
//           <Box key={day} display="flex" flexDirection="column" alignItems="center">
//             <PathStep
//               step={{ id: day + 1, x: 0, y: 0 }} 
//               completedDays={completedDays[language] || 0} 
//               handleLessonClick={handleStepClick}
//             >
//               Day {day + 1} 
//             </PathStep>
//             {day < days - 1 && (
//               <div className="path-line" />
//             )}
//           </Box>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RoadMap;
