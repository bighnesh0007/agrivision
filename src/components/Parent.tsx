"use client"; // Ensure this is a client component

import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import LocationAccessPrompt from '@/app/location';
import { FloatingDockDemo } from '@/app/FloatingDock';
import { useRouter } from 'next/navigation'; 
import ChatBot from './chatbot';
interface ParentComponentProps {
  children: React.ReactNode;
  
}


const ParentComponent: React.FC<ParentComponentProps> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('en');
   const [refresh,setre] = useState(false);
   const router  = useRouter()
  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    reload(lang)
  };
function reload(lang:string){
  router.push(`/?lang=${lang}`)
 
 
}
  console.log(currentLang)
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onLanguageChange={handleLanguageChange}  />
      
      {/* Location Access Prompt */}
      <div className='absolute left-[60%]'>
        {/* <LocationAccessPrompt /> */}
      </div>
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar currentLang={currentLang} />

        {/* Main Content */}
        <main className="flex-1 p-4">
          {children}
          <ChatBot />
        </main>
      </div>
    </div>
  );
};

export default ParentComponent;
