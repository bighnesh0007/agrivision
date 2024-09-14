'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FaRobot, FaCloudUploadAlt, FaSeedling, FaCloudSunRain, FaTint, FaThermometerHalf, FaWind, FaSun, FaLeaf, FaCheck, FaInfoCircle, FaCalendarAlt, FaCamera } from 'react-icons/fa'
import { useDropzone } from 'react-dropzone'
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab'
// import { ErrorBoundary } from 'react-error-boundary'

type TranslationKey = 'cropDetails' | 'cropMonitoring' | 'notifyChanges' | 'analysis' | 'environment' | 'roadmap' | 'seedQualityAnalysis' | 'uploadSeedImage' | 'dragDropSeed' | 'useCamera' | 'analyzeSeedQuality' | 'seedQuality' | 'soilAnalysis' | 'uploadSoilImage' | 'dragDropSoil' | 'analyzeSoilQuality' | 'soilQuality' | 'weatherAnalysis' | 'checkWeather' | 'fetchWeather' | 'analyzeWeather' | 'currentWeather'

type TranslationType = {
  [key in TranslationKey]: string
}

const translations: Record<string, TranslationType> = {
  en: {
    cropDetails: "Crop Details for",
    cropMonitoring: "Crop Monitoring Active",
    notifyChanges: "Your crop is being monitored 24/7. We'll notify you of any significant changes.",
    analysis: "Analysis",
    environment: "Environment",
    roadmap: "Roadmap",
    seedQualityAnalysis: "Seed Quality Analysis",
    uploadSeedImage: "Upload a seed image for analysis",
    dragDropSeed: "Drag & drop a seed image here, or click to select one",
    useCamera: "Use Camera",
    analyzeSeedQuality: "Analyze Seed Quality",
    seedQuality: "Seed Quality",
    soilAnalysis: "Soil Analysis",
    uploadSoilImage: "Upload a soil image for analysis",
    dragDropSoil: "Drag & drop a soil image here, or click to select one",
    analyzeSoilQuality: "Analyze Soil Quality",
    soilQuality: "Soil Quality",
    weatherAnalysis: "Weather Analysis",
    checkWeather: "Check current weather conditions",
    fetchWeather: "Click the button below to fetch current weather data for optimal crop growth.",
    analyzeWeather: "Analyze Weather",
    currentWeather: "Current Weather"
  },
  es: {
    cropDetails: "फसल का विवरण",
    cropMonitoring: "फसल की निगरानी सक्रिय",
    notifyChanges: "आपकी फसल की 24/7 निगरानी की जा रही है। हम आपको किसी भी महत्वपूर्ण परिवर्तन के बारे में सूचित करेंगे।",
    analysis: "विश्लेषण",
    environment: "पर्यावरण",
    roadmap: "रोडमैप",
    seedQualityAnalysis: "बीज गुणवत्ता विश्लेषण",
    uploadSeedImage: "विश्लेषण के लिए बीज की छवि अपलोड करें",
    dragDropSeed: "बीज की छवि यहां खींचें और छोड़ें, या एक चुनने के लिए क्लिक करें",
    useCamera: "कैमरा का उपयोग करें",
    analyzeSeedQuality: "बीज गुणवत्ता का विश्लेषण करें",
    seedQuality: "बीज गुणवत्ता",
    soilAnalysis: "मिट्टी विश्लेषण",
    uploadSoilImage: "विश्लेषण के लिए मिट्टी की छवि अपलोड करें",
    dragDropSoil: "मिट्टी की छवि यहां खींचें और छोड़ें, या एक चुनने के लिए क्लिक करें",
    analyzeSoilQuality: "मिट्टी की गुणवत्ता का विश्लेषण करें",
    soilQuality: "मिट्टी की गुणवत्ता",
    weatherAnalysis: "मौसम विश्लेषण",
    checkWeather: "वर्तमान मौसम की स्थिति की जांच करें",
    fetchWeather: "इष्टतम फसल वृद्धि के लिए वर्तमान मौसम डेटा प्राप्त करने के लिए नीचे दिए गए बटन पर क्लिक करें।",
    analyzeWeather: "मौसम का विश्लेषण करें",
    currentWeather: "वर्तमान मौसम"
  }
}

const MotionCard = motion(Card)

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default function EnhancedCropDetails() {
  const { cropId } = useParams()
  const searchParams = useSearchParams()
  const lang = searchParams.get('lang') || 'en'
  const t = translations[lang as keyof typeof translations] || translations['en']

  const [seedImage, setSeedImage] = useState<string | null>(null)
  const [soilImage, setSoilImage] = useState<string | null>(null)
  const [seedQuality, setSeedQuality] = useState<string | null>(null)
  const [soilQuality, setSoilQuality] = useState<string | null>(null)
  const [weather, setWeather] = useState<string | null>(null)
  const [moisture, setMoisture] = useState(50)
  const [temperature, setTemperature] = useState(20)
  const [windSpeed, setWindSpeed] = useState(5)
  const [sunlight, setSunlight] = useState(70)
  const [autoIrrigation, setAutoIrrigation] = useState(false)
  const [isOptimalCondition, setIsOptimalCondition] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [growthStage, setGrowthStage] = useState('Seedling')
  const [cropType, setCropType] = useState('')
  const [region, setRegion] = useState('')
  const [soilType, setSoilType] = useState('')
  const [season, setSeason] = useState('')
  const [sowingDate, setSowingDate] = useState('')
  const [harvestDate, setHarvestDate] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [roadmap, setRoadmap] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (setState: (value: string | null) => void) => (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target) {
        setState(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const onDrop = useCallback((acceptedFiles: File[], setState: (value: string | null) => void) => {
    if (acceptedFiles.length > 0) {
      handleImageUpload(setState)(acceptedFiles[0])
    }
  }, [])

  const { getRootProps: getSeedRootProps, getInputProps: getSeedInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, setSeedImage),
    accept: { 'image/*': [] },
  })

  const { getRootProps: getSoilRootProps, getInputProps: getSoilInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, setSoilImage),
    accept: { 'image/*': [] },
  })

  const analyzeSeedQuality = () => {
    const mockQualities = ['Excellent', 'Good', 'Fair', 'Poor']
    setSeedQuality(mockQualities[Math.floor(Math.random() * mockQualities.length)])
  }

  const analyzeSoilQuality = () => {
    const mockQualities = ['Rich', 'Balanced', 'Needs Fertilizer', 'Poor']
    setSoilQuality(mockQualities[Math.floor(Math.random() * mockQualities.length)])
  }

  const analyzeWeather = () => {
    const mockWeather = ['Sunny', 'Rainy', 'Cloudy', 'Windy']
    setWeather(mockWeather[Math.floor(Math.random() * mockWeather.length)])
  }

  const startCropCycle = () => {
    alert("Starting crop cycle with optimal conditions!")
  }

  useEffect(() => {
    setIsOptimalCondition(
      seedQuality !== null &&
      soilQuality !== null &&
      weather !== null &&
      seedQuality !== 'Poor' &&
      soilQuality !== 'Poor' &&
      weather !== 'Windy'
    )
  }, [seedQuality, soilQuality, weather])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const generateRoadmap = async () => {
    setIsLoading(true)
    // Simulating AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock AI-generated roadmap
    const mockRoadmap = [
      "Soil Preparation: Prepare the soil with organic matter and ensure proper pH levels.",
      "Sowing: Plant seeds at the recommended depth and spacing for your crop type.",
      "Germination: Maintain optimal moisture and temperature for seed germination.",
      "Seedling Care: Provide adequate water and protect young plants from pests.",
      "Vegetative Growth: Apply fertilizers and monitor for any signs of disease or nutrient deficiencies.",
      "Flowering/Fruiting: Ensure proper pollination and continue pest management.",
      "Maturation: Monitor crop for signs of maturity and prepare for harvest.",
      "Harvest: Harvest the crop at peak maturity for best quality and yield."
    ]

    setRoadmap(mockRoadmap)
    setIsLoading(false)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0])
    }
  }

  return (
    // <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen p-8 bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <h1 className="text-4xl font-bold">{t.cropDetails} {cropId}</h1>
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={`Crop ${cropId}`} />
              <AvatarFallback>{cropId}</AvatarFallback>
            </Avatar>
          </motion.div>

          <Alert className="mb-8">
            <FaLeaf className="h-4 w-4" />
            <AlertTitle>{t.cropMonitoring}</AlertTitle>
            <AlertDescription>
              {t.notifyChanges}
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="analysis" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis">{t.analysis}</TabsTrigger>
              <TabsTrigger value="environment">{t.environment}</TabsTrigger>
              <TabsTrigger value="roadmap">{t.roadmap}</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <TabsContent value="analysis">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <MotionCard className="w-full" variants={cardVariants} initial="hidden" animate="visible">
                    <CardHeader>
                      <CardTitle>{t.seedQualityAnalysis}</CardTitle>
                      <CardDescription>{t.uploadSeedImage}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div {...getSeedRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-primary">
                        <input {...getSeedInputProps()} />
                        <p>{t.dragDropSeed}</p>
                        <Button className="mt-2" onClick={() => document.getElementById('seedCamera')?.click()}>
                          <FaCamera className="mr-2" /> {t.useCamera}
                        </Button>
                        <input
                          id="seedCamera"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(setSeedImage)(e.target.files[0])
                            }
                          }}
                        />
                      </div>
                      {seedImage && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4"
                        >
                          <img src={seedImage} alt="Uploaded seed" className="w-full h-48 object-cover rounded-md" />
                        </motion.div>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col items-center">
                      <Button className="w-full" onClick={analyzeSeedQuality} disabled={!seedImage}>
                        <FaCloudUploadAlt className="mr-2 h-4 w-4" /> {t.analyzeSeedQuality}
                      </Button>
                      {seedQuality && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Badge variant="outline" className="mt-4">
                            {t.seedQuality}: {seedQuality}
                          </Badge>
                        </motion.div>
                      )}
                    </CardFooter>
                  </MotionCard>

                  <MotionCard className="w-full" variants={cardVariants} initial="hidden" animate="visible">
                    <CardHeader>
                      <CardTitle>{t.soilAnalysis}</CardTitle>
                      <CardDescription>{t.uploadSoilImage}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div {...getSoilRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-primary">
                        <input {...getSoilInputProps()} />
                        <p>{t.dragDropSoil}</p>
                        <Button className="mt-2" onClick={() => document.getElementById('soilCamera')?.click()}>
                          <FaCamera className="mr-2" /> {t.useCamera}
                        </Button>
                        <input
                          id="soilCamera"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(setSoilImage)(e.target.files[0])
                            }
                          }}
                        />
                      </div>
                      {soilImage && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4"
                        >
                          <img src={soilImage} alt="Uploaded soil" className="w-full h-48 object-cover rounded-md" />
                        </motion.div>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col items-center">
                      <Button className="w-full" onClick={analyzeSoilQuality} disabled={!soilImage}>
                        <FaSeedling className="mr-2 h-4 w-4" /> {t.analyzeSoilQuality}
                      </Button>
                      {soilQuality && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Badge variant="outline" className="mt-4">
                            {t.soilQuality}: {soilQuality}
                          </Badge>
                        </motion.div>
                      )}
                    </CardFooter>
                  </MotionCard>

                  <MotionCard className="w-full" variants={cardVariants} initial="hidden" animate="visible">
                    <CardHeader>
                      <CardTitle>{t.weatherAnalysis}</CardTitle>
                      <CardDescription>{t.checkWeather}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-gray-500 dark:text-gray-400">{t.fetchWeather}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center">
                      <Button className="w-full" onClick={analyzeWeather}>
                        <FaCloudSunRain className="mr-2 h-4 w-4" /> {t.analyzeWeather}
                      </Button>
                      {weather && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Badge variant="outline" className="mt-4">
                            {t.currentWeather}: {weather}
                          </Badge>
                        </motion.div>
                      )}
                    </CardFooter>
                  </MotionCard>
                </div>
              </TabsContent>
              <TabsContent value="environment">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <MotionCard variants={cardVariants} initial="hidden" animate="visible">
                    <CardHeader>
                      <CardTitle>Moisture Level</CardTitle>
                      <CardDescription>Current soil moisture</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <FaTint className="text-blue-500" />
                        <Progress value={moisture} className="w-[60%]" />
                        <span>{moisture}%</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="auto-irrigation"
                                checked={autoIrrigation}
                                onCheckedChange={setAutoIrrigation}
                              />
                              <Label htmlFor="auto-irrigation">Auto Irrigation</Label>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enable automatic irrigation based on moisture levels</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardFooter>
                  </MotionCard>

                  <MotionCard variants={cardVariants} initial="hidden" animate="visible">
                    <CardHeader>
                      <CardTitle>Temperature</CardTitle>
                      <CardDescription>Current temperature</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <FaThermometerHalf className="text-red-500" />
                        <Slider
                          value={[temperature]}
                          max={50}
                          step={1}
                          className="w-[60%]"
                          onValueChange={(value) => setTemperature(value[0])}
                        />
                        <span>{temperature}°C</span>
                      </div>
                    </CardContent>
                  </MotionCard>

                  <MotionCard variants={cardVariants} initial="hidden" animate="visible">
                    <CardHeader>
                      <CardTitle>Wind Speed</CardTitle>
                      <CardDescription>Current wind conditions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <FaWind className="text-gray-500" />
                        <Slider
                          value={[windSpeed]}
                          max={30}
                          step={1}
                          className="w-[60%]"
                          onValueChange={(value) => setWindSpeed(value[0])}
                        />
                        <span>{windSpeed} km/h</span>
                      </div>
                    </CardContent>
                  </MotionCard>

                  <MotionCard variants={cardVariants} initial="hidden" animate="visible">
                    <CardHeader>
                      <CardTitle>Sunlight</CardTitle>
                      <CardDescription>Current sunlight intensity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <FaSun className="text-yellow-500" />
                        <Progress value={sunlight} className="w-[60%]" />
                        <span>{sunlight}%</span>
                      </div>
                    </CardContent>
                  </MotionCard>
                </div>
              </TabsContent>
              <TabsContent value="roadmap">
                <MotionCard variants={cardVariants} initial="hidden" animate="visible">
                  <CardHeader>
                    <CardTitle>Crop Growth Roadmap</CardTitle>
                    <CardDescription>Track your crop's journey from seed to harvest</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Timeline position="alternate">
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot color="primary" />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <h3 className="font-bold">Seed Germination</h3>
                          <p>Day 1-7</p>
                        </TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot color="primary" />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <h3 className="font-bold">Seedling Stage</h3>
                          <p>Day 8-21</p>
                        </TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot color="primary" />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <h3 className="font-bold">Vegetative Stage</h3>
                          <p>Day 22-50</p>
                        </TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot color="primary" />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <h3 className="font-bold">Flowering Stage</h3>
                          <p>Day 51-80</p>
                        </TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot color="primary" />
                        </TimelineSeparator>
                        <TimelineContent>
                          <h3 className="font-bold">Harvest Stage</h3>
                          <p>Day 81+</p>
                        </TimelineContent>
                      </TimelineItem>
                    </Timeline>
                  </CardContent>
                </MotionCard>
              </TabsContent>
            </AnimatePresence>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <MotionCard
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              initial="hidden"
              animate="visible"
            >
              <CardHeader>
                <CardTitle>AI-Powered Crop Roadmap Generator</CardTitle>
                <CardDescription>Enter crop details or upload a photo to generate a customized growth roadmap</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cropType">Crop Type</Label>
                      <Input id="cropType" value={cropType} onChange={(e) => setCropType(e.target.value)} placeholder="e.g., Tomato" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region/Location</Label>
                      <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g., Midwest USA" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="soilType">Soil Type</Label>
                      <Select value={soilType} onValueChange={setSoilType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="loamy">Loamy</SelectItem>
                          <SelectItem value="clay">Clay</SelectItem>
                          <SelectItem value="sandy">Sandy</SelectItem>
                          <SelectItem value="silt">Silt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="season">Season</Label>
                      <Select value={season} onValueChange={setSeason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spring">Spring</SelectItem>
                          <SelectItem value="summer">Summer</SelectItem>
                          <SelectItem value="fall">Fall</SelectItem>
                          <SelectItem value="winter">Winter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sowingDate">Sowing Date</Label>
                      <Input id="sowingDate" type="date" value={sowingDate} onChange={(e) => setSowingDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="harvestDate">Expected Harvest Date</Label>
                      <Input id="harvestDate" type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photo">Upload Crop Photo (Optional)</Label>
                    <Input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={generateRoadmap} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <FaRobot className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaRobot className="mr-2 h-4 w-4" />
                      Generate AI Roadmap
                    </>
                  )}
                </Button>
              </CardFooter>
            </MotionCard>

            <MotionCard
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              initial="hidden"
              animate="visible"
            >
              <CardHeader>
                <CardTitle>AI-Generated Crop Roadmap</CardTitle>
                <CardDescription>Your personalized crop growth plan</CardDescription>
              </CardHeader>
              <CardContent>
                {roadmap.length > 0 ? (
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <Accordion type="single" collapsible className="w-full">
                      {roadmap.map((step, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                          <AccordionTrigger>Step {index + 1}</AccordionTrigger>
                          <AccordionContent>{step}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    <p>Generate a roadmap to see your personalized crop growth plan</p>
                  </div>
                )}
              </CardContent>
            </MotionCard>
          </div>

          {isOptimalCondition && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <Alert>
                <FaCheck className="h-4 w-4" />
                <AlertTitle>Optimal Conditions Detected</AlertTitle>
                <AlertDescription>
                  All conditions are favorable for starting the crop cycle.
                </AlertDescription>
              </Alert>
              <Link href={'/VegetativeStage'}>
              <Button className="mt-4" onClick={startCropCycle}>
                Start Crop Cycle
              </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    // </ErrorBoundary>
  )
}