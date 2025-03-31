"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/app/firebase/config';
import { collection, doc, setDoc, updateDoc, getDoc, onSnapshot, serverTimestamp, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';

interface LanguageSpace {
  id?: string;
  language: string;
  activeSpeakers: string[];
  listeners: string[];
  status: 'active' | 'scheduled';
  topic: string;
  hostId?: string;
}

const DEFAULT_LANGUAGES = [
  'Spanish',
  'French',
  'German',
  'Italian',
  'Japanese',
  'Chinese',
  'Korean',
  'Russian'
];

function PracticeSection() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [spaces, setSpaces] = useState<LanguageSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to active spaces
    const spacesRef = collection(firestore, 'languageSpaces');
    const activeSpacesQuery = query(spacesRef, where("status", "==", "active"));
    
    const unsubscribe = onSnapshot(activeSpacesQuery, (snapshot) => {
      const spacesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LanguageSpace[];
      
      if (spacesData.length === 0) {
        // If no spaces exist, create default language options
        const defaultSpaces = DEFAULT_LANGUAGES.map(language => ({
          language,
          activeSpeakers: [],
          listeners: [],
          status: 'active' as const,
          topic: `${language} Practice Session`,
        }));
        setSpaces(defaultSpaces);
      } else {
        setSpaces(spacesData);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleJoinSpace = async (space: LanguageSpace) => {
    if (!user) {
      alert('Please sign in to join a language space');
      router.push('/login');
      return;
    }

    try {
      // If the space has an ID, it already exists in Firestore
      if (space.id) {
        const spaceRef = doc(firestore, 'languageSpaces', space.id);
        const spaceDoc = await getDoc(spaceRef);
        
        if (spaceDoc.exists()) {
          const spaceData = spaceDoc.data();
          const listeners = [...(spaceData.listeners || [])];
          
          if (!listeners.includes(user.uid)) {
            listeners.push(user.uid);
            await updateDoc(spaceRef, { listeners });
          }
          
          router.push(`/space/${space.id}`);
        }
      } else {
        // Create a new space for this language
        await handleCreateSpace(space.language);
      }
    } catch (error) {
      console.error('Error joining space:', error);
      alert('Failed to join the space. Please try again.');
    }
  };

  const handleCreateSpace = async (language: string) => {
    if (!user) {
      alert('Please sign in to create a space');
      router.push('/login');
      return;
    }

    setSelectedLanguage(language);

    try {
      const spacesRef = collection(firestore, 'languageSpaces');
      const newSpaceRef = doc(spacesRef);
      
      await setDoc(newSpaceRef, {
        language,
        topic: `${language} Practice Session`,
        activeSpeakers: [user.uid],
        listeners: [],
        status: 'active',
        hostId: user.uid,
        createdAt: serverTimestamp()
      });

      router.push(`/space/${newSpaceRef.id}`);
    } catch (error) {
      console.error('Error creating space:', error);
      alert('Failed to create space. Please try again.');
      setSelectedLanguage(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Language Spaces
        </h1>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Join a language space to practice speaking with others or create your own space to host a conversation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {spaces.map((space, index) => (
            <motion.div 
              key={space.id || index}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              className="bg-white shadow-md rounded-xl overflow-hidden"
            >
              <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {space.language}
                  </h2>
                  <span className={`${space.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'} text-white px-2 py-1 rounded-full text-sm`}>
                    {space.id ? 'Live' : 'Create New'}
                  </span>
                </div>
                
                <h3 className="text-lg text-gray-700 mb-4">{space.topic}</h3>
                
                {space.id ? (
                  <div className="flex items-center gap-4 mb-6 text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">{space.activeSpeakers.length}</span> speaking
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">{space.listeners.length}</span> listening
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 text-gray-600">
                    Be the first to start a {space.language} conversation!
                  </div>
                )}

                <motion.button 
                  onClick={() => handleJoinSpace(space)}
                  className="w-full bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-gray-400 font-medium"
                  disabled={!user || selectedLanguage === space.language}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedLanguage === space.language ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : space.id ? (
                    'Join Space'
                  ) : (
                    'Create Space'
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default PracticeSection;
