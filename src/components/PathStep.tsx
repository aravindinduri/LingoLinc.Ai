"use client";

import React from 'react';
import { Tooltip } from '@mui/material';
import { CheckCircle, Lock } from '@mui/icons-material';

interface PathStepProps {
  step: { id: number; x: number; y: number };
  completedDays: number;
  handleLessonClick: (day: number) => void;
}

const PathStep: React.FC<PathStepProps> = ({ step, completedDays, handleLessonClick }) => {
  return (
    <div
      className={`roadmap-step ${step.id <= completedDays ? 'completed' : 'locked'}`}
      style={{ left: `${step.x}%`, top: `${step.y}%` }}
      onClick={() => handleLessonClick(step.id)}
    >
      <Tooltip title={step.id <= completedDays ? 'Completed' : 'Locked'}>
        <div>
          {step.id <= completedDays ? <CheckCircle /> : <Lock />}
        </div>
      </Tooltip>
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
        }
        .completed {
          background: #4caf50;
        }
        .locked {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default PathStep;
