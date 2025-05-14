"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, updateDoc, getDoc, setDoc, query, collection, where } from 'firebase/firestore';
import { auth, firestore } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
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

export default function SpacePage() {
  const params = useParams();
  const router = useRouter();
  const spaceId = params.id as string;
  const [user] = useAuthState(auth);
  const [spaceData, setSpaceData] = useState<SpaceData | null>(null);
  const [peers, setPeers] = useState<Record<string, Peer.Instance>>({});
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const selfAudioRef = useRef<HTMLAudioElement>(null);

  // Fetch space data and set up listeners
  useEffect(() => {
    if (!spaceId) return;

    const spaceRef = doc(firestore, 'languageSpaces', spaceId);
    const unsubscribeSpace = onSnapshot(spaceRef, (doc) => {
      if (doc.exists()) {
        setSpaceData(doc.data() as SpaceData);
      } else {
        alert('This language space no longer exists');
        router.push('/');
      }
    });

    return () => {
      unsubscribeSpace();
    };
  }, [spaceId, router]);

  // Get user media (microphone) and set up peer connections
  useEffect(() => {
    if (!user || !spaceData) return;

    const getMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        setIsMicOn(true);

      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Please allow microphone access to participate.');
      }
    };

    if (spaceData.activeSpeakers.includes(user.uid)) {
      getMicrophone();
    } else {
      setAudioStream(null);
      setIsMicOn(false);
    }
  }, [user, spaceData]);

    useEffect(() => {
        if (selfAudioRef.current) {
            selfAudioRef.current.muted = !isMicOn;
        }
    }, [isMicOn])

  // Initialize and manage peer connections
  useEffect(() => {
    if (!user || !spaceData || !audioStream) return;

    const initializePeers = async () => {
      const currentPeers: Record<string, Peer.Instance> = {};

      // Create peers for existing speakers (excluding self)
      spaceData.activeSpeakers.forEach(async (speakerId) => {
        if (speakerId !== user.uid) {
          const peer = new Peer({
            initiator: true, // I am initiating the connection
            stream: audioStream,
            trickle: false, // Disable trickle ICE for simplicity
          });

          peer.on('signal', async (signal) => {
            // Send signal to Firestore
            await setDoc(
              doc(firestore, 'signals', `${user.uid}-${speakerId}`),
              { from: user.uid, to: speakerId, signal },
              { merge: true }
            );
          });

          peer.on('stream', (remoteStream) => {
            // Handle incoming audio stream
            const audio = new Audio();
            audio.srcObject = remoteStream;
            audio.play();
          });

          currentPeers[speakerId] = peer;
        }
      });

      setPeers(currentPeers);
    };

    initializePeers();

    // Listen for incoming signals
    const signalsQuery = query(
      collection(firestore, 'signals'),
      where('to', '==', user.uid)
    );

    const unsubscribeSignals = onSnapshot(signalsQuery, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const { from, signal } = change.doc.data();

          // If peer doesn't exist, create it
          if (!peers[from]) {
            const peer = new Peer({
              initiator: false, // I am receiving the connection
              stream: audioStream,
              trickle: false,
            });

            peer.on('signal', async (signal) => {
              // Send response signal back
              await setDoc(
                doc(firestore, 'signals', `${user.uid}-${from}`),
                { from: user.uid, to: from, signal },
                { merge: true }
              );
            });

            peer.on('stream', (remoteStream) => {
              // Handle incoming audio stream
              const audio = new Audio();
              audio.srcObject = remoteStream;
              audio.play();
            });

            // Signal the peer with the data from Firestore
            peer.signal(signal);
            setPeers((prevPeers) => ({ ...prevPeers, [from]: peer }));
          } else {
            // Signal existing peer
            peers[from].signal(signal);
          }
        }
      });
    });

    return () => {
      Object.values(peers).forEach((peer) => peer.destroy());
      unsubscribeSignals();
    };
  }, [user, spaceData, audioStream, peers, spaceData?.activeSpeakers]);

  // Function to toggle microphone
  const toggleMicrophone = () => {
    if (audioStream) {
      audioStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
    }
  };

  // Function to request to speak (example)
  const requestToSpeak = async () => {
    // Implement logic to request speaking role (e.g., update Firestore)
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Language Space</h1>
            {spaceData ? (
              <div className="divide-y divide-gray-200">
                <div className="py-4 text-base leading-6 space-y-2 text-gray-700 sm:text-lg sm:leading-7">
                  <p className="font-bold">Language: {spaceData.language}</p>
                  <p>Topic: {spaceData.topic}</p>
                  <p>Active Speakers: {spaceData.activeSpeakers.join(', ')}</p>
                </div>
                <div className="py-4 flex justify-around">
                  <button
                    onClick={toggleMicrophone}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {isMicOn ? 'Mute' : 'Unmute'}
                  </button>
                  <button
                    onClick={requestToSpeak}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Request to Speak
                  </button>
                                </div>
                                <audio ref={selfAudioRef} muted={!isMicOn} autoPlay />

              </div>
            ) : (
              <p className="text-center">Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
