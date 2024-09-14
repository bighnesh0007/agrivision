'use client';
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import WeatherCardAstronomy from "@/app/Astronomy";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaSeedling,
  FaSun,
  FaMoon,
  FaChevronDown,
  FaChevronUp,
  FaAppleAlt,
  FaBeer,
  FaSpa,
  FaLeaf,
  FaDisease,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

import { FaWheatAwn } from "react-icons/fa6";
import { SiGooglelens } from "react-icons/si";
import { GiSugarCane, GiCottonFlower, GiCorn, GiTomato, GiPotato } from "react-icons/gi";
import { RiRoadMapLine } from "react-icons/ri";
import { MdKeyboardVoice, MdPestControl } from "react-icons/md";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { BiSolidDashboard } from "react-icons/bi";
import { TbLemon } from "react-icons/tb";
const translations = {
  en: {
    home: "Home",
    weatherDashboard: "Weather Lens",
    cropDashboard: "Crop Tracker",
    soilDashboard: "Soil Scope",
    identify: "Plant Profile",
    cropRecommendation: "Crop Selector",
    soilQualityAnalysis: "Soil Insight",
    fertilizerRecommendation: "Fertilizer Guide",
    cropRoadMap: "Crop Journey",
    voiceToSearch: "Speech2Text",
    diseaseDetection: "Disease Detection",
    vegetables: "Vegetables",
    fruits: "Fruits",
    crops: "Crops",
    others: "Others",
    pestDetection: "Pest Detection",
    potato: "Potato",
    tomato: "Tomato",
    apple: "Apple",
    lemon: "Lemon",
    rice: "Rice",
    wheat: "Wheat",
    sugarcane: "Sugarcane",
    pulses: "Pulses",
    maize: "Maize",
    barley: "Barley",
    soybean: "Soybean",
    groundnut: "Groundnut",
    cottonLeaf: "Cotton Leaf",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    plantIdentifier: "dfsfv" // Added entry
  },
  es: {
    home: "होम",
    weatherDashboard: "मौसम डैशबोर्ड",
    cropDashboard: "फसल डैशबोर्ड",
    soilDashboard: "मिट्टी डैशबोर्ड",
    identify: "पहचानें",
    cropRecommendation: "फसल सिफारिश",
    soilQualityAnalysis: "मिट्टी गुणवत्ता विश्लेषण",
    fertilizerRecommendation: "उर्वरक सिफारिश",
    cropRoadMap: "फसल रोडमैप",
    voiceToSearch: "वॉयस सर्च",
    diseaseDetection: "बीमारी पहचान",
    vegetables: "सब्जियाँ",
    fruits: "फruits",
    crops: "फसलें",
    others: "अन्य",
    pestDetection: "कीट पहचान",
    potato: "आलू",
    tomato: "टमाटर",
    apple: "सेब",
    lemon: "नींबू",
    rice: "चावल",
    wheat: "गेहूँ",
    sugarcane: "गन्ना",
    pulses: "दालें",
    maize: "मक्का",
    barley: "जौ",
    soybean: "सोयाबीन",
    groundnut: "मूँगफली",
    cottonLeaf: "कपास की पत्तियाँ",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    plantIdentifier: "प्लांट आइडेंटिफायर" // Added entry
  }
};


interface SidebarProps {
  currentLang: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentLang }) => {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [diseaseMenuOpen, setDiseaseMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  let t = translations.en;
  if (currentLang === 'en') {
    t = translations.en;
  } else if (currentLang === 'es') {
    t = translations.es;
  }

  const navItems = [
    { name: t.home, href: `/?lang=${currentLang}`, icon: (props: any) => (
      <Image
        src="/home1.gif"
        alt="Home"
        width={24}
        height={24}
        {...props}
      />
    ) },
    { name: t.weatherDashboard, href: `/WeatherDashboard?lang=${currentLang}`, icon: (props: any) => (
      <Image
        src="/weather.gif"
        alt="Home"
        width={24}
        height={24}
        {...props}
      />
    ) },
    { name: t.cropDashboard, href: `/CropDashboard?lang=${currentLang}`, icon: (props: any) => (
      <Image
        src="/crop.gif"
        alt="Home"
        width={24}
        height={24}
        {...props}
      />
    )  },
    { name: t.soilDashboard, href: `/SoilDashboard?lang=${currentLang}`, icon: (props: any) => (
      <Image
        src="/soil.gif"
        alt="Home"
        width={24}
        height={24}
        {...props}
      />
    ) },
    { name: t.identify, href: `/identify?lang=${currentLang}`, icon: (props: any) => (
      <Image
        src="/plant.gif"
        alt="Home"
        width={24}
        height={24}
        {...props}
      />
    )  },
    { name: t.cropRecommendation, href: `/CropRecommendation?lang=${currentLang}`, icon: (props: any) => (
      <Image
        src="/crop selector.gif"
        alt="Home"
        width={24}
        height={24}
        {...props}
      />
    )   },
    { name: t.soilQualityAnalysis, href: `/SoilQualityAnalysis?lang=${currentLang}`, icon: (props: any) => (
      <Image
        src="/soil insight.gif"
        alt="Home"
        width={24}
        height={24}
        {...props}
      />
    )  },
    {name: t.fertilizerRecommendation, href: `/fertilizerRecommendation?lang=${currentLang}`, icon: (props: any) => (
      <Image
        src="/fertilizer.gif"
        alt="Home"
        width={24}
        height={24}
        {...props}
      />
    )  },
    { name: t.cropRoadMap, href: `/CropRoadMapBuilder?lang=${currentLang}`, icon: (props: any) => (
      <Image
        src="/loc.gif"
        alt="Home"
        width={24}
        height={24}
        {...props}
      />
    )  },
    { name: t.voiceToSearch, href: `/voice?lang=${currentLang}`, icon: (props: any) => (
      <Image
        src="/mic.gif"
        alt="Home"
        width={24}
        height={24}
        {...props}
      />
    )  },
  ];

  const diseaseCategories = [
    {
      category: t.vegetables,
      items: [
        { name: t.potato, href: `/disease/potato?lang=${currentLang}`, icon: GiPotato },
        { name: t.tomato, href: `/disease/tomato?lang=${currentLang}`, icon: GiTomato },
      ],
    },
    {
      category: t.fruits,
      items: [
        { name: t.apple, href: `/disease/apple?lang=${currentLang}`, icon: FaAppleAlt },
        { name: t.lemon, href: `/disease/lemon?lang=${currentLang}`, icon: TbLemon },
      ],
    },
    {
      category: t.crops,
      items: [
        { name: t.wheat, href: `/disease/wheat?lang=${currentLang}`, icon: FaWheatAwn },
        { name: t.sugarcane, href: `/disease/sugarcane?lang=${currentLang}`, icon: GiSugarCane },
        { name: t.pulses, href: `/disease/pulses?lang=${currentLang}`, icon: FaSeedling },
        { name: t.maize, href: `/disease/maize?lang=${currentLang}`, icon: GiCorn },
        { name: t.barley, href: `/disease/barley?lang=${currentLang}`, icon: FaBeer },
        { name: t.soybean, href: `/disease/soyabean?lang=${currentLang}`, icon: FaSpa },
        { name: t.groundnut, href: `/disease/groundnut?lang=${currentLang}`, icon: FaLeaf },
        { name: t.cottonLeaf, href: `/disease/cotton-leaf?lang=${currentLang}`, icon: GiCottonFlower },
      ],
    },
    {
      category: t.others,
      items: [
        { name: t.pestDetection, href: `/disease/pest?lang=${currentLang}`, icon: MdPestControl },
      ],
    },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex flex-col h-screen p-4 m-3 bg-white shadow-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && (
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
            Over View
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-800 dark:text-green-400 dark:hover:bg-green-700"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <ul className="space-y-2 text-sm">
          {navItems.map((item) => (
            <li key={item.name} className="rounded-lg">
              <Link
                href={item.href}
                className={`flex items-center p-3 space-x-4 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-white"
                    : "hover:bg-green-50 dark:hover:bg-green-800 dark:text-gray-300"
                }`}
              >
                <item.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
          <li className="rounded-lg">
            <button
              onClick={() => setDiseaseMenuOpen(!diseaseMenuOpen)}
              className="flex items-center w-full p-3 space-x-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-800 transition-all duration-200 dark:text-gray-300"
            >
              <FaDisease className="w-6 h-6 text-green-600 dark:text-green-400" />
              {!isCollapsed && (
                <>
                  <span>{t.diseaseDetection}</span>
                  {diseaseMenuOpen ? (
                    <FaChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <FaChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  )}
                </>
              )}
            </button>
            {diseaseMenuOpen && !isCollapsed && (
              <ul className="mt-2 space-y-2 ml-6">
                {diseaseCategories.map((category) => (
                  <li key={category.category}>
                    <h3 className="text-gray-700 dark:text-gray-300">{category.category}</h3>
                    <ul className="space-y-1 mt-1">
                      {category.items.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`flex items-center p-2 space-x-3 rounded-lg transition-all duration-200 ${
                              pathname === item.href
                                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-white"
                                : "hover:bg-green-50 dark:hover:bg-green-800 dark:text-gray-300"
                            }`}
                          >
                            <item.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>
      <button
        onClick={toggleDarkMode}
        className="flex items-center p-3 space-x-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-800 transition-all duration-200 dark:text-gray-300"
      >
        {isDarkMode ? (
          <FaSun className="w-6 h-6 text-green-600 dark:text-green-400" />
        ) : (
          <FaMoon className="w-6 h-6 text-green-600 dark:text-green-400" />
        )}
        {!isCollapsed && <span>{isDarkMode ? t.lightMode : t.darkMode}</span>}
      </button>
    </div>
  );
};

export default Sidebar;
