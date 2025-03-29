// "use client";

// import React from 'react';
// import { Tooltip } from '@mui/material';
// import { CheckCircle, Lock } from '@mui/icons-material';

// interface PathStepProps {
//   step: { id: number; x: number; y: number };
//   completedDays: number;
//   handleLessonClick: (day: number) => void;
// }

// const PathStep: React.FC<PathStepProps> = ({ step, completedDays, handleLessonClick }) => {
//   return (
//     <div
//       className={`roadmap-step ${step.id <= completedDays ? 'completed' : 'locked'}`}
//       style={{ left: `${step.x}%`, top: `${step.y}%` }}
//       onClick={() => handleLessonClick(step.id)}
//     >
//       <Tooltip title={step.id <= completedDays ? 'Completed' : 'Locked'}>
//         <div>
//           {step.id <= completedDays ? <CheckCircle /> : <Lock />}
//         </div>
//       </Tooltip>
//       <style jsx>{`
//         .roadmap-step {
//           position: absolute;
//           background: #fff;
//           border-radius: 50%;
//           padding: 8px;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .completed {
//           background: #4caf50;
//         }
//         .locked {
//           background: #e0e0e0;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PathStep;
"use client";

import React from 'react';
import { Tooltip } from '@mui/material';
import { CheckCircle, Lock } from '@mui/icons-material';

interface PathStepProps {
  step: { id: number; x: number; y: number };
  completedDays: number;
  handleLessonClick: (day: number) => void;
  children: React.ReactNode; // Add children prop
}

const PathStep: React.FC<PathStepProps> = ({ step, completedDays, handleLessonClick, children }) => {
  const isCompleted = step.id <= completedDays;
  
  return (
    <div
      className={`roadmap-step ${isCompleted ? 'completed' : 'locked'}`}
      style={{ left: `${step.x}%`, top: `${step.y}%` }}
      onClick={() => isCompleted && handleLessonClick(step.id)}
      role="button"
      tabIndex={0} 
      onKeyPress={(e) => { if (e.key === 'Enter') handleLessonClick(step.id); }}
      aria-label={isCompleted ? `Day ${step.id} Completed` : `Day ${step.id} Locked`}
    >
      <Tooltip title={isCompleted ? 'Completed' : 'Locked'}>
        <div>
          {isCompleted ? <CheckCircle /> : <Lock />}
        </div>
      </Tooltip>
      <div>{children}</div> 
      <style jsx>{`
        .roadmap-step {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s, transform 0.3s;
        }
        .roadmap-step:hover {
          transform: scale(1.05);
        }
        .completed {
          background: #4caf50; /* Green for completed steps */
        }
        .locked {
          background: #e0e0e0; /* Grey for locked steps */
        }
      `}</style>
    </div>
  );
};

export default PathStep;
