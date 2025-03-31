"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, updateDoc, getDoc, setDoc, query, collection, where } from 'firebase/firestore';
import { auth, firestore } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { MicrophoneIcon as MicOn, SpeakerWaveIcon as SpeakerOn } from '@heroicons/react/24/solid';
import { MicrophoneIcon as MicOff, SpeakerXMarkIcon as SpeakerOff } from '@heroicons/react/24/outline';
import Peer from 'simple-peer';

interface SpaceData {
  language: string;
  topic: string;
  activeSpeakers: string[];
  listeners: string[];
  createdAt: any;
  hostId: string;
  status: string;
}

interface UserProfile {
  displayName: string;
  photoURL: string;
  level?: string;
}

export default function SpacePage() {
  const params = useParams();
  const router = useRouter();
  const spaceId = params.id as string;
  const [user] = useAuthState(auth);
  const [spaceData, setSpaceData] = useState<SpaceData | null>(null);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [isLeaving, setIsLeaving] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [peers, setPeers] = useState<Record<string, Peer.Instance>>({});
  const existingPeersRef = useRef<Record<string, boolean>>({});
  const destroyedPeersRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!spaceId) return;

    const fetchUserProfile = async (userId: string) => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfiles(prev => ({
            ...prev,
            [userId]: {
              displayName: userData.displayName || 'Anonymous User',
              photoURL: userData.photoURL || '/default-avatar.png',
              level: userData.level || 'Beginner'
            }
          }));
        } else {
          setUserProfiles(prev => ({
            ...prev,
            [userId]: {
              displayName: 'Anonymous User',
              photoURL: '/default-avatar.png',
              level: 'Beginner'
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const unsubscribe = onSnapshot(doc(firestore, 'languageSpaces', spaceId), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as SpaceData;
        setSpaceData(data);
        
        // Fetch profiles for all participants
        [...data.activeSpeakers, ...data.listeners].forEach(fetchUserProfile);
      } else {
        // Space doesn't exist
        alert('This language space no longer exists');
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [spaceId, router]);

  useEffect(() => {
    if (!user || !spaceData) return;

    const isSpeaking = spaceData.activeSpeakers.includes(user.uid);
    
    const setupAudio = async () => {
      try {
        if (isSpeaking && !audioStream) {
          // Get user's microphone stream
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setAudioStream(stream);
          setIsMicOn(true);
          
          // Here you would normally send this stream to other users
          // This requires a signaling server and WebRTC implementation
          console.log("Microphone activated");
        } else if (!isSpeaking && audioStream) {
          // Stop streaming if user is no longer a speaker
          audioStream.getTracks().forEach(track => track.stop());
          setAudioStream(null);
          setIsMicOn(false);
          console.log("Microphone deactivated");
        }
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Could not access your microphone. Please check your permissions.");
      }
    };

    setupAudio();

    // Cleanup function
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [user, spaceData, audioStream]);

  useEffect(() => {
    if (!user || !audioStream || !spaceData) return;
    
    const newPeers: Record<string, Peer.Instance> = {};
    let hasNewPeers = false;
    
    // Create new peer connections only for speakers we don't have yet
    spaceData.activeSpeakers.forEach(speakerId => {
      if (speakerId !== user.uid && !existingPeersRef.current[speakerId]) {
        existingPeersRef.current[speakerId] = true;
        hasNewPeers = true;
        
        // Create a new peer connection
        const peer = new Peer({
          initiator: true,
          stream: audioStream,
          trickle: false,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });
        
        // Handle signaling
        peer.on('signal', (data: any) => {
          console.log('Sending signal to peer:', speakerId, data);
          try {
            const signalRef = doc(firestore, 'signals', `${user.uid}-${speakerId}`);
            setDoc(signalRef, { 
              from: user.uid, 
              to: speakerId, 
              signal: data,
              timestamp: Date.now() // Add timestamp to ensure proper ordering
            });
          } catch (error) {
            console.error('Error sending signal:', error);
          }
        });
        
        // Handle incoming stream
        peer.on('stream', (stream: MediaStream) => {
          console.log('Received stream from peer:', speakerId);
          
          const audio = new Audio();
          audio.srcObject = stream;
          audio.autoplay = true;
          audio.volume = 1.0;
          
          audio.play()
            .then(() => console.log('Audio playback started successfully'))
            .catch(err => console.error('Audio playback failed:', err));
          
          audio.onplay = () => console.log('Audio is playing');
          audio.onpause = () => console.log('Audio is paused');
          audio.onerror = (e) => console.error('Audio error:', e);
          
          audio.setAttribute('data-peer-id', speakerId);
          document.body.appendChild(audio);
        });
        
        newPeers[speakerId] = peer;
      }
    });
    
    // Only update state if we have new peers
    if (hasNewPeers) {
      setPeers(prev => ({ ...prev, ...newPeers }));
    }
    
    // Listen for incoming signals
    const unsubscribe = onSnapshot(
      query(collection(firestore, 'signals'), where('to', '==', user.uid)),
      snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = change.doc.data();
            const { from, signal } = data;
            
            console.log('Received signal data:', data);
            
            // Handle the signal outside of the render cycle
            setTimeout(() => {
              setPeers(currentPeers => {
                if (currentPeers[from] && !destroyedPeersRef.current[from]) {
                  // Only signal if the peer exists and hasn't been destroyed
                  try {
                    // Check if the peer is in a state where it can receive signals
                    if (currentPeers[from]._connected) {
                      console.log('Peer already connected, ignoring signal');
                      return currentPeers;
                    }
                    currentPeers[from].signal(signal);
                  } catch (error) {
                    console.error('Error signaling peer:', error);
                    // If there's an error with this peer, mark it as destroyed
                    destroyedPeersRef.current[from] = true;
                    // Try to clean up
                    try {
                      currentPeers[from].destroy();
                    } catch (e) {
                      console.error('Error destroying problematic peer:', e);
                    }
                    // Return a new peers object without the problematic peer
                    const { [from]: _, ...remainingPeers } = currentPeers;
                    return remainingPeers;
                  }
                } else if (!existingPeersRef.current[from] && !destroyedPeersRef.current[from]) {
                  existingPeersRef.current[from] = true;
                  
                  // Create a new peer
                  const peer = new Peer({
                    initiator: false,
                    stream: audioStream,
                    trickle: false
                  });
                  
                  peer.on('signal', (data: any) => {
                    const signalRef = doc(firestore, 'signals', `${user.uid}-${from}`);
                    setDoc(signalRef, { from: user.uid, to: from, signal: data });
                  });
                  
                  peer.on('stream', (stream: MediaStream) => {
                    console.log('Received stream from peer:', from);
                    const audio = new Audio();
                    audio.srcObject = stream;
                    audio.play();
                  });
                  
                  peer.signal(signal);
                  
                  return { ...currentPeers, [from]: peer };
                }
                return currentPeers;
              });
            }, 0);
          }
        });
      }
    );
    
    return () => {
      unsubscribe();
      Object.entries(newPeers).forEach(([peerId, peer]) => {
        destroyedPeersRef.current[peerId] = true;
        peer.destroy();
      });
    };
  }, [user, audioStream, spaceData]);

  // Add a cleanup effect for when the component unmounts
  useEffect(() => {
    return () => {
      // Clean up all peers when component unmounts
      Object.entries(peers).forEach(([peerId, peer]) => {
        destroyedPeersRef.current[peerId] = true;
        try {
          peer.destroy();
        } catch (error) {
          console.error('Error destroying peer:', error);
        }
      });
    };
  }, [peers]);

  const handleRoleToggle = async () => {
    if (!user || !spaceData) return;

    const spaceRef = doc(firestore, 'languageSpaces', spaceId);
    const isSpeaking = spaceData.activeSpeakers.includes(user.uid);
    
    try {
      if (isSpeaking) {
        // Switch to listener
        await updateDoc(spaceRef, {
          activeSpeakers: spaceData.activeSpeakers.filter(id => id !== user.uid),
          listeners: [...spaceData.listeners, user.uid]
        });
      } else {
        // Switch to speaker
        await updateDoc(spaceRef, {
          activeSpeakers: [...spaceData.activeSpeakers, user.uid],
          listeners: spaceData.listeners.filter(id => id !== user.uid)
        });
      }
    } catch (error) {
      console.error('Error toggling role:', error);
      alert('Failed to change role. Please try again.');
    }
  };

  const handleLeaveSpace = async () => {
    if (!user || !spaceData) return;
    setIsLeaving(true);

    const spaceRef = doc(firestore, 'languageSpaces', spaceId);
    try {
      await updateDoc(spaceRef, {
        activeSpeakers: spaceData.activeSpeakers.filter(id => id !== user.uid),
        listeners: spaceData.listeners.filter(id => id !== user.uid)
      });
      router.push('/');
    } catch (error) {
      console.error('Error leaving space:', error);
      alert('Failed to leave space. Please try again.');
      setIsLeaving(false);
    }
  };

  const toggleMicrophone = async () => {
    if (!audioStream) return;
    
    audioStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    
    setIsMicOn(!isMicOn);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsAudioOn(!isAudioOn);
    }
  };

  // 3. Add debug logging for microphone tracks
  useEffect(() => {
    if (audioStream) {
      console.log('Audio tracks:', audioStream.getAudioTracks());
      audioStream.getAudioTracks().forEach(track => {
        console.log('Audio track enabled:', track.enabled, 'muted:', track.muted);
      });
    }
  }, [audioStream]);

  // 4. Add connection state logging
  useEffect(() => {
    Object.entries(peers).forEach(([peerId, peer]) => {
      peer.on('connect', () => {
        console.log('Peer connection established!');
      });
      peer.on('error', (err) => {
        console.error('Peer connection error:', err);
      });
    });
  }, [peers]);

  if (!user) {
    return (
      <div className="min-h-screen p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to join language spaces</h1>
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

  if (!spaceData) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const isSpeaking = spaceData.activeSpeakers.includes(user.uid);
  const isHost = spaceData.hostId === user.uid;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">{spaceData.language} Space</h1>
                <p className="text-indigo-100 mt-2">{spaceData.topic}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  {spaceData.status}
                </span>
                <button 
                  onClick={handleLeaveSpace}
                  disabled={isLeaving}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                  {isLeaving ? 'Leaving...' : 'Leave Space'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Speakers Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Speakers</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {spaceData.activeSpeakers.map((speakerId) => (
                    <motion.div
                      key={speakerId}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="bg-gray-50 p-4 rounded-lg flex items-center gap-3"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold">
                          {userProfiles[speakerId]?.displayName?.charAt(0) || '?'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <p className="font-medium">{userProfiles[speakerId]?.displayName || 'Loading...'}</p>
                        <p className="text-sm text-gray-500">{userProfiles[speakerId]?.level || 'Beginner'}</p>
                      </div>
                      {speakerId === spaceData.hostId && (
                        <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Host</span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Listeners Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Listeners</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {spaceData.listeners.map((listenerId) => (
                    <motion.div
                      key={listenerId}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="bg-gray-50 p-4 rounded-lg flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {userProfiles[listenerId]?.displayName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium">{userProfiles[listenerId]?.displayName || 'Loading...'}</p>
                        <p className="text-sm text-gray-500">{userProfiles[listenerId]?.level || 'Beginner'}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-center gap-4 mb-4">
                {spaceData?.activeSpeakers.includes(user?.uid || '') && (
                  <button
                    onClick={toggleMicrophone}
                    className={`p-3 rounded-full ${isMicOn ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    {isMicOn ? (
                      <MicOn className="h-6 w-6 text-white" />
                    ) : (
                      <MicOff className="h-6 w-6 text-gray-600" />
                    )}
                  </button>
                )}
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full ${isAudioOn ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  {isAudioOn ? (
                    <SpeakerOn className="h-6 w-6 text-white" />
                  ) : (
                    <SpeakerOff className="h-6 w-6 text-gray-600" />
                  )}
                </button>
              </div>

              <motion.button 
                onClick={handleRoleToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  isSpeaking 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                {isSpeaking ? '🎤 Switch to Listener' : '🎙️ Start Speaking'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio element for playing incoming audio */}
      <audio ref={audioRef} autoPlay />
    </motion.div>
  );
} 