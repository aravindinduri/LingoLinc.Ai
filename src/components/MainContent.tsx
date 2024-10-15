
"use client";
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DailyStreaksCalendar from './DailyStreaks';
import Learn from './Learn';
import ProfileSection from './ProfileSection';
const MainContent: React.FC = () => {
  const [section, setSection] = useState<string>('learn');

  const renderSection = () => {
    switch (section) {
      case 'learn':
        return <div><Learn/></div>;
      case 'practice':
        return <div>Practice Section</div>;
      case 'streaks':
        return <div><DailyStreaksCalendar/></div>;
      case 'profile':
        return <div><ProfileSection/></div>;
      default:
        return <div>Learn Section</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar setSection={setSection} />
      <main className="flex-1 p-8 mt-16 md:ml-60"> 
        {renderSection()}
      </main>
    </div>
  );
};

export default MainContent;
