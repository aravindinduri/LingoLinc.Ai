// app/page.tsx
"use client"
import { ReactNode } from 'react';

interface HomeProps {
  activeSection: string;
}

const Home: React.FC<HomeProps> = ({ activeSection }) => {
  return (
    <div>
      {activeSection === 'learn' && (
        <div>
          <h1>Learn New Languages</h1>
          <p>Here you can find language learning resources and exercises.</p>
        </div>
      )}
      {activeSection === 'streaks' && (
        <div>
          <h1>Daily Streaks</h1>
          <p>Check your daily progress and streaks here.</p>
        </div>
      )}
      {activeSection === 'practice' && (
        <div>
          <h1>Practice Your Skills</h1>
          <p>Engage in practice activities and challenges.</p>
        </div>
      )}
      {!activeSection && (
        <div>
          <h1>Welcome to LingoLinc!</h1>
          <p>Select a section from the sidebar to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
