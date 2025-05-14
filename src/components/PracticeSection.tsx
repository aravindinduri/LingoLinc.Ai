"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/app/firebase/config'; // Assuming firebase config is here
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
  const [user, loadingAuth] = useAuthState(auth); // use loadingAuth to check auth state loading
  const [spaces, setSpaces] = useState<LanguageSpace[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(true); // Separate loading state for spaces
  const [creatingSpace, setCreatingSpace] = useState<string | null>(null); // Track which language space is being created

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
        // If no active spaces exist, show default language options to create one
        const defaultSpaces = DEFAULT_LANGUAGES.map(language => ({
          language,
          activeSpeakers: [], // No active speakers initially for a 'creatable' space
          listeners: [], // No listeners initially
          status: 'active' as const, // Mark as active to be displayed as an option
          topic: `${language} Practice Session`,
        }));
        setSpaces(defaultSpaces);
      } else {
        // Show existing active spaces and also add options for languages that don't have active spaces
        const existingLanguages = spacesData.map(space => space.language);
        const creatableSpaces = DEFAULT_LANGUAGES
          .filter(lang => !existingLanguages.includes(lang))
          .map(language => ({
            language,
            activeSpeakers: [],
            listeners: [],
            status: 'active' as const,
            topic: `${language} Practice Session`,
          }));
        setSpaces([...spacesData, ...creatableSpaces]);
      }
      
      setLoadingSpaces(false);
    }, (error) => {
      console.error("Error fetching spaces:", error);
      setLoadingSpaces(false);
      // Optionally set an error state to display to the user
    });

    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  const handleJoinOrCreateSpace = async (space: LanguageSpace) => {
    if (loadingAuth) return; // Prevent action while auth state is loading

    if (!user) {
      alert('Please sign in to join or create a language space');
      router.push('/login');
      return;
    }
    
    if (creatingSpace) return; // Prevent multiple creation attempts

    setCreatingSpace(space.language); // Indicate that we are attempting to join/create this space

    try {
      // Check if the space already exists by ID (meaning it was fetched from Firestore)
      if (space.id) {
        console.log(`Attempting to join existing space: ${space.id}`);
        const spaceRef = doc(firestore, 'languageSpaces', space.id);
        const spaceDoc = await getDoc(spaceRef);
        
        if (spaceDoc.exists()) {
          // Update listeners array in Firestore
          const spaceData = spaceDoc.data();
          const currentListeners = spaceData.listeners || [];
          if (!currentListeners.includes(user.uid)) {
            await updateDoc(spaceRef, {
              listeners: [...currentListeners, user.uid]
            });
             console.log(`Added user ${user.uid} to listeners in space ${space.id}`);
          }
          // Navigate to the space page
          router.push(`/space/${space.id}`);
        } else {
          // This case should ideally not happen if fetched from snapshot, but as a fallback:
          alert('Space no longer exists. Please try another.');
           setCreatingSpace(null); // Reset state if joining failed
        }
      } else {
        // If space.id is not present, it's a default language option to create a new space
        console.log(`Attempting to create new space for language: ${space.language}`);
        const spacesRef = collection(firestore, 'languageSpaces');
        const newSpaceRef = doc(spacesRef); // Let Firestore generate a new ID
        const newSpaceId = newSpaceRef.id;
        
        await setDoc(newSpaceRef, {
          language: space.language,
          topic: `${space.language} Practice Session`, // Default topic
          activeSpeakers: [user.uid], // Creator is the first speaker
          listeners: [],
          status: 'active', // Mark as active immediately
          hostId: user.uid, // Creator is the host
          createdAt: serverTimestamp()
        });
        console.log(`Created new space ${newSpaceId} for language ${space.language}`);

        // Navigate to the newly created space page
        router.push(`/space/${newSpaceId}`);
      }
    } catch (error) {
      console.error('Error joining or creating space:', error);
      alert('Failed to process space request. Please try again.');
       setCreatingSpace(null); // Reset state on error
    }
  };

  // Show loading spinner while auth or spaces are loading
  if (loadingAuth || loadingSpaces) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Show sign-in message if user is not authenticated after loading
  if (!user) {
    return (
      <div className="min-h-screen p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access language spaces</h1>
          <button 
            onClick={() => router.push('/login')}
            className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600"
          >
            Go to Login
          </button>
        </div>
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
              key={space.id || space.language} // Use space.id or language as key
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              className="bg-white shadow-md rounded-xl overflow-hidden"
            >
              <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {space.language}
                  </h2>
                  {space.id ? (
                     <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">Live</span>
                  ) : (
                     <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">Create New</span>
                  )}
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
                  onClick={() => handleJoinOrCreateSpace(space)}
                  className="w-full bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-gray-400 font-medium flex items-center justify-center"
                  disabled={creatingSpace === space.language} // Disable button while creating/joining this space
                  whileTap={{ scale: 0.98 }}
                >
                  {creatingSpace === space.language ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
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
