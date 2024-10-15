"use client";

import React, { useState } from 'react';
import {  Mail, MapPin, Calendar, Edit2, Camera } from 'lucide-react';
interface InfoItemProps {
  icon: React.ReactNode; 
  text: string;         
}
const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);

  const dummyData = {
    name: 'Aravind Induri',
    email: 'thearavindinduri@gmail.com',
    location: 'Hyderabad India',
    occupation: 'Senior Software Engineer',
    joinDate: 'Joined January 2024',
    bio: "I'm passionate about learning new languages and solving challenges through creativity. When I'm not studying languages, you'll find me exploring different cultures or practicing my conversation skills.",
    languages: ['French', 'German',],
    achievements: [
      { title: '5 Day Streak', icon: '🔥' },
      { title: 'Quiz Master', icon: '🏆' },
      { title: 'Early Bird', icon: '🌅' },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 rounded-xl shadow-lg">
      <div className="relative mb-8">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src="https://i.ibb.co/ZM5ngJS/download.jpg"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <button className="absolute bottom-0 right-1/2 transform translate-x-16 translate-y-3 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors duration-300">
          <Camera size={20} />
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-400 mb-2">{dummyData.name}</h1>
        <p className="text-gray-500 flex items-center justify-center">
          <MapPin size={18} className="mr-[160px]" />
          {dummyData.location}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4 text-gray-500">
          <InfoItem icon={<Mail className='relative' />} text={dummyData.email} />
          <InfoItem icon={<Calendar className='relative'/>} text={dummyData.joinDate} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            Bio
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              <Edit2 size={18} />
            </button>
          </h2>
          {isEditing ? (
            <textarea
              className="w-full h-32 p-2 border rounded"
              defaultValue={dummyData.bio}
            />
          ) : (
            <p className="text-gray-700">{dummyData.bio}</p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl text-gray-400 font-semibold mb-4">Languages</h2>
        <div className="flex flex-wrap gap-2">
          {dummyData.languages.map((lang, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {dummyData.achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300"
            >
              <span className="text-4xl mb-2">{achievement.icon}</span>
              <h3 className="font-medium text-gray-800">{achievement.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<InfoItemProps> = ({ icon, text }) => (
  <div className="flex items-center space-x-2 text-gray-700">
    {icon}
    <span>{text}</span>
  </div>
);


export default ProfileSection;