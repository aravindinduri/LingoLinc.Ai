'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';

const HomePage = () => {
  const [language, setLanguage] = useState('');
  const [day, setDay] = useState(1);
  const [output, setOutput] = useState('');
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    console.log(user)
    if (!loading && user) {
      router.push('/pages/home');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/learn', {
        language,
        day,
      });

      setOutput(response.data.output);
    } catch (error) {
      console.error('Error fetching data:', error);
      setOutput('An error occurred while fetching data.');
    }
  };

  return (
    <div>
      <h1>Language Learning App</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Language:
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </label>
        <br />
        <label>
          Day:
          <input
            type="number"
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
          />
        </label>
        <br />
        <button type="submit">Get Words and Sentences</button>
      </form>
      {output && (
        <div>
          <h2>Output</h2>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default HomePage;
