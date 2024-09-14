"use client";
import React, { useEffect, useState } from 'react';
import { Globe, ChevronDown, Phone, BarChart2, Rocket, DollarSign } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface NavbarProps {
  onLanguageChange: (lang: string) => void;
}

const translations = {
  en: {
    appName: 'ArgiVision',
    analysis: 'Analysis',
    robofarmer: 'RoboFarmer',
    economicStatus: 'Economic Status',
    phone: 'Initiating call...',
    soilAnalysis: 'Soil Analysis',
    cropHealth: 'Crop Health',
    weatherPatterns: 'Weather Patterns',
    roboStatus: 'RoboFarmer Status',
    scheduleTasks: 'Schedule Tasks',
    maintenance: 'Maintenance',
    marketTrends: 'Market Trends',
    profitAnalysis: 'Profit Analysis',
    economicForecast: 'Economic Forecast'
  },
  es: {
    appName: 'प्लांटएआई',
    analysis: 'विश्लेषण',
    robofarmer: 'रोबोफ़ार्मर',
    economicStatus: 'आर्थिक स्थिति',
    phone: 'कॉल शुरू हो रही है...',
    soilAnalysis: 'मिट्टी विश्लेषण',
    cropHealth: 'फसल स्वास्थ्य',
    weatherPatterns: 'मौसम पैटर्न',
    roboStatus: 'रोबोफ़ार्मर स्थिति',
    scheduleTasks: 'कार्य अनुसूची',
    maintenance: 'रखरखाव',
    marketTrends: 'बाजार प्रवृत्तियां',
    profitAnalysis: 'लाभ विश्लेषण',
    economicForecast: 'आर्थिक पूर्वानुमान'
  }
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'हिंदी' },
];

const Navbar: React.FC<NavbarProps> = ({ onLanguageChange }) => {
  const searchParams = useSearchParams();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(searchParams.get('lang') || 'en');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  let t = translations.en;
  if (currentLang === 'en') {
    t = translations.en;
  } else if (currentLang === 'es') {
    t = translations.es;
  }
  useEffect(() => {
    onLanguageChange(currentLang);
  }, [currentLang, onLanguageChange]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    setIsLanguageOpen(false);
  };

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

 

  return (
    <nav className="bg-white shadow-lg dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {t.appName}
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <DropdownMenu
              title={t.analysis}
              icon={<BarChart2 className="w-5 h-5 mr-1" />}
              options={[
                { id: 'soil', name: t.soilAnalysis, href: '/analysis/soil' },
                { id: 'crop', name: t.cropHealth, href: '/analysis/crop' },
                { id: 'weather', name: t.weatherPatterns, href: '/analysis/weather' }
              ]}
              isOpen={openDropdown === 'analysis'}
              onToggle={() => handleDropdownToggle('analysis')}
            />
            <DropdownMenu
              title={t.robofarmer}
              icon={<Rocket className="w-5 h-5 mr-1" />}
              options={[
                { id: 'status', name: t.roboStatus, href: '/robofarmer/status' },
                { id: 'schedule', name: t.scheduleTasks, href: '/robofarmer/schedule' },
                { id: 'maintenance', name: t.maintenance, href: '/robofarmer/maintenance' }
              ]}
              isOpen={openDropdown === 'robofarmer'}
              onToggle={() => handleDropdownToggle('robofarmer')}
            />
            <DropdownMenu
              title={t.economicStatus}
              icon={<DollarSign className="w-5 h-5 mr-1" />}
              options={[
                { id: 'market', name: t.marketTrends, href: '/economic/market' },
                { id: 'profit', name: t.profitAnalysis, href: '/economic/profit' },
                { id: 'forecast', name: t.economicForecast, href: '/economic/forecast' }
              ]}
              isOpen={openDropdown === 'economic'}
              onToggle={() => handleDropdownToggle('economic')}
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => console.log(t.phone)}
              className="flex items-center text-gray-700 hover:text-green-500 dark:text-gray-300"
            >
              <Phone className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                className="flex items-center text-gray-700 hover:text-green-500 dark:text-gray-300"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <Globe className="w-5 h-5 mr-1" />
                <span>{languages.find(lang => lang.code === currentLang)?.name}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 w-full text-left"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <SignedOut>
              <div className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                <SignInButton />
              </div>
            </SignedOut>
            <SignedIn>
              <div className="rounded-full overflow-hidden">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface DropdownMenuProps {
  title: string;
  icon: React.ReactNode;
  options: { id: string; name: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, icon, options, isOpen, onToggle }) => {
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center text-gray-700 hover:text-green-500 dark:text-gray-300 dark:hover:text-green-400"
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {icon}
        <span>{title}</span>
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10"
          >
            {options.map((option) => (
              <Link
                key={option.id}
                href={option.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 w-full text-left"
                onClick={onToggle}
              >
                {option.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
