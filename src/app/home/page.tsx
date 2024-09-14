'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sun, Cloud, Leaf, Snowflake, ChevronRight, Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Translation JSON

 
  const translations = {

      en: {
    pageTitle: "Seasonal Crop Planner",
    pageDescription: "Select a season and crops to plan your garden",
    chooseSeason: "Choose a season",
    seasonInfo: "Season information",
    crops: "Crops",
    filterByDifficulty: "Filter by difficulty",
    allDifficulties: "All difficulties",
    selectedCrops: "Selected crops:",
    viewFirstCrop: "View first selected crop",
    spring: "Spring",
    summer: "Summer",
    autumn: "Autumn",
    winter: "Winter",
    springDescription: "A time for new beginnings and growth.",
    summerDescription: "Peak growing season with long, warm days.",
    autumnDescription: "A time for harvest and preparing for winter.",
    winterDescription: "A time for hardy crops and indoor gardening.",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    difficultyLevel: "Difficulty level:",
    
    cropsBySeason: {
      spring: {
        title: "Spring Crops",
        crops: {
          lettuce: "Lettuce",
          peas: "Peas",
          carrots: "Carrots",
          spinach: "Spinach",
          asparagus: "Asparagus",
        }
      },
      summer: {
        title: "Summer Crops",
        crops: {
          tomatoes: "Tomatoes",
          peppers: "Peppers",
          cucumbers: "Cucumbers",
          corn: "Corn",
          zucchini: "Zucchini",
          eggplant: "Eggplant",
        }
      },
      autumn: {
        title: "Autumn Crops",
        crops: {
          pumpkins: "Pumpkins",
          squash: "Squash",
          apples: "Apples",
          broccoli: "Broccoli",
          brusselsSprouts: "Brussels Sprouts",
          cauliflower: "Cauliflower",
        }
      },
      winter: {
        title: "Winter Crops",
        crops: {
          kale: "Kale",
          winterSquash: "Winter Squash",
          onions: "Onions",
          garlic: "Garlic",
          leeks: "Leeks",
          microgreens: "Microgreens",
        }
      }
    }
  },
    es: {
      pageTitle: "मौसमी फसल योजनाकार",
      pageDescription: "अपने बगीचे की योजना बनाने के लिए एक मौसम और फसलों का चयन करें",
      chooseSeason: "एक मौसम चुनें",
      seasonInfo: "मौसम की जानकारी",
      crops: "फसलें",
      filterByDifficulty: "कठिनाई के अनुसार फ़िल्टर करें",
      allDifficulties: "सभी कठिनाइयाँ",
      selectedCrops: "चयनित फसलें:",
      viewFirstCrop: "पहली चयनित फसल देखें",
      spring: "वसंत",
      summer: "गर्मी",
      autumn: "पतझड़",
      winter: "सर्दी",
      springDescription: "नई शुरुआत और विकास का समय।",
      summerDescription: "लंबे, गर्म दिनों के साथ शीर्ष उगाने का मौसम।",
      autumnDescription: "फसल कटाई और सर्दियों की तैयारी का मौसम।",
      winterDescription: "मजबूत फसलों और इनडोर बागवानी का समय।",
      easy: "आसान",
      medium: "मध्यम",
      hard: "कठिन",
      difficultyLevel: "कठिनाई स्तर:",
      
      cropsBySeason: {
        spring: {
          title: "वसंत फसलें",
          crops: {
            lettuce: "लेट्यूस",
            peas: "मटर",
            carrots: "गाजर",
            spinach: "पालक",
            asparagus: "एस्पैरेगस",
          }
        },
        summer: {
          title: "ग्रीष्मकालीन फसलें",
          crops: {
            tomatoes: "टमाटर",
            peppers: "मिर्च",
            cucumbers: "खीरा",
            corn: "मकई",
            zucchini: "तोरी",
            eggplant: "बैंगन",
          }
        },
        autumn: {
          title: "पतझड़ फसलें",
          crops: {
            pumpkins: "कद्दू",
            squash: "स्क्वैश",
            apples: "सेब",
            broccoli: "ब्रोकली",
            brusselsSprouts: "ब्रसल्स स्प्राउट्स",
            cauliflower: "फूलगोभी",
          }
        },
        winter: {
          title: "सर्दी फसलें",
          crops: {
            kale: "केल",
            winterSquash: "विंटर स्क्वैश",
            onions: "प्याज",
            garlic: "लहसुन",
            leeks: "लीक",
            microgreens: "माइक्रोग्रीन्स",
          }
        }
      }
    }
  }
  


const seasons = [
  { name: 'spring', icon: <Leaf className="w-6 h-6 text-green-400" /> },
  { name: 'summer', icon: <Sun className="w-6 h-6 text-yellow-400" /> },
  { name: 'autumn', icon: <Cloud className="w-6 h-6 text-orange-400" /> },
  { name: 'winter', icon: <Snowflake className="w-6 h-6 text-blue-400" /> }
]

const crops = {
  spring: [
    { name: 'lettuce', url: '/crops/lettuce', difficulty: 'easy' },
    { name: 'peas', url: '/crops/peas', difficulty: 'medium' },
    { name: 'carrots', url: '/crops/carrots', difficulty: 'easy' },
    { name: 'spinach', url: '/crops/spinach', difficulty: 'easy' },
    { name: 'asparagus', url: '/crops/asparagus', difficulty: 'hard' },
  ],
  summer: [
    { name: 'tomatoes', url: '/crops/tomatoes', difficulty: 'medium' },
    { name: 'peppers', url: '/crops/peppers', difficulty: 'medium' },
    { name: 'cucumbers', url: '/crops/cucumbers', difficulty: 'easy' },
    { name: 'corn', url: '/crops/corn', difficulty: 'hard' },
    { name: 'zucchini', url: '/crops/zucchini', difficulty: 'easy' },
    { name: 'eggplant', url: '/crops/eggplant', difficulty: 'medium' },
  ],
  autumn: [
    { name: 'pumpkins', url: '/crops/pumpkins', difficulty: 'medium' },
    { name: 'squash', url: '/crops/squash', difficulty: 'easy' },
    { name: 'apples', url: '/crops/apples', difficulty: 'hard' },
    { name: 'broccoli', url: '/crops/broccoli', difficulty: 'medium' },
    { name: 'brussels-sprouts', url: '/crops/brussels-sprouts', difficulty: 'hard' },
    { name: 'cauliflower', url: '/crops/cauliflower', difficulty: 'medium' },
  ],
  winter: [
    { name: 'kale', url: '/crops/kale', difficulty: 'easy' },
    { name: 'winter-squash', url: '/crops/winter-squash', difficulty: 'medium' },
    { name: 'onions', url: '/crops/onions', difficulty: 'easy' },
    { name: 'garlic', url: '/crops/garlic', difficulty: 'easy' },
    { name: 'leeks', url: '/crops/leeks', difficulty: 'medium' },
    { name: 'microgreens', url: '/crops/microgreens', difficulty: 'easy' },
  ]
}

export default function EnhancedSeasonSelector() {
  const [selectedSeason, setSelectedSeason] = useState('spring')
  const [selectedCrops, setSelectedCrops] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<string>('all')
  const [isMounted, setIsMounted] = useState(false)

  const searchParams = useSearchParams()
  const lang = searchParams.get('lang') || 'en'
  const t = translations[lang as keyof typeof translations]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season)
    setSelectedCrops([])
    setDifficulty('all')
  }

  const handleCropToggle = (cropName: string) => {
    setSelectedCrops((prev) =>
      prev.includes(cropName) ? prev.filter((c) => c !== cropName) : [...prev, cropName]
    )
  }

  const handleRemoveCrop = (cropName: string) => {
    setSelectedCrops((prev) => prev.filter((c) => c !== cropName))
  }

  const filteredCrops = crops[selectedSeason as keyof typeof crops].filter(
    (crop) => difficulty === 'all' || crop.difficulty === difficulty
  )

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">{t.pageTitle}</CardTitle>
          <CardDescription className="text-center">{t.pageDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full mb-6">
            <AccordionItem value="seasons">
              <AccordionTrigger>{t.chooseSeason}</AccordionTrigger>
              <AccordionContent>
                <RadioGroup value={selectedSeason} onValueChange={handleSeasonChange} className="grid grid-cols-2 gap-4">
                  {seasons.map((season) => (
                    <Label
                      key={season.name}
                      htmlFor={season.name}
                      className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <RadioGroupItem value={season.name} id={season.name} />
                      <div className="flex items-center space-x-2">
                        {season.icon}
                        <span>{t[season.name as keyof typeof t]}</span>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <AnimatePresence>
            {selectedSeason && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertTitle>{t.seasonInfo}</AlertTitle>
                  <AlertDescription>
                    {t[`${selectedSeason}Description` as keyof typeof t]}
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">{t[selectedSeason as keyof typeof t]} {t.crops}</h3>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t.filterByDifficulty} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allDifficulties}</SelectItem>
                      <SelectItem value="easy">{t.easy}</SelectItem>
                      <SelectItem value="medium">{t.medium}</SelectItem>
                      <SelectItem value="hard">{t.hard}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-4">
                    {filteredCrops.map((crop) => (
                      <div key={crop.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Checkbox
                            id={crop.name}
                            checked={selectedCrops.includes(crop.name)}
                            onCheckedChange={() => handleCropToggle(crop.name)}
                          />
                          <label
                            htmlFor={crop.name}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {crop.name}
                          </label>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant={crop.difficulty === 'easy' ? 'secondary' : crop.difficulty === 'medium' ? 'default' : 'destructive'}>
                                {t[crop.difficulty as keyof typeof t]}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t.difficultyLevel} {t[crop.difficulty as keyof typeof t]}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {selectedCrops.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">{t.selectedCrops}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCrops.map((crop) => (
                        <Badge key={crop} variant="outline" className="py-1 px-2">
                          {crop}
                          <button
                            onClick={() => handleRemoveCrop(crop)}
                            className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            aria-label={`Remove ${crop}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.selectedCrops} {selectedCrops.length}
            </p>
          </div>
          {selectedCrops.length > 0 && (
            <Link 
            href={{
              pathname: crops[selectedSeason as keyof typeof crops].find(c => c.name === selectedCrops[0])?.url || '#',
              query: { lang: lang }  // assuming `selectedLang` holds the language code
            }}>
              <Button>
                {t.viewFirstCrop} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}