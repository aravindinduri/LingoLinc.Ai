// components/MainContent.tsx
"use client";
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Learn from './Learn';

const MainContent: React.FC = () => {
  const [section, setSection] = useState<string>('learn');

  const renderSection = () => {
    switch (section) {
      case 'learn':
        return <div><Learn/></div>;
      case 'practice':
        return <div>Practice Section</div>;
      case 'streaks':
        return <div>Daily Streaks Section</div>;
      case 'profile':
        return <div>Profile Section</div>;
      default:
        return <div>Learn Section</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar setSection={setSection} />
      <main className="flex-1 p-8 mt-16 md:ml-60"> {/* Adjust margins */}
        {renderSection()}
      </main>
    </div>
  );
};

export default MainContent;
