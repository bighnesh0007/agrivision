'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Droplet, Thermometer, Wind, AlertTriangle, Loader, Sprout, Soup, Camera, Bug } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialGrowthData = [
    { name: 'Week 1', height: 5 },
    { name: 'Week 2', height: 10 },
    { name: 'Week 3', height: 18 },
    { name: 'Week 4', height: 25 },
]

export default function Dashboard() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [waterLevel, setWaterLevel] = useState(50)
    const [growthStage, setGrowthStage] = useState(0)
    const [growthData, setGrowthData] = useState(initialGrowthData)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [temperature, setTemperature] = useState(24)
    const [humidity, setHumidity] = useState(65)
    const [moisture, setMoisture] = useState(50)
    const [soilType, setSoilType] = useState('')
    const [cropType, setCropType] = useState('')
    const [nitrogen, setNitrogen] = useState(0)
    const [phosphorous, setPhosphorous] = useState(0)
    const [fertilizerRecommendation, setFertilizerRecommendation] = useState('')
    const [diseaseImage, setDiseaseImage] = useState<string | null>(null)
    const [pestImage, setPestImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const pestFileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const interval = setInterval(() => {
            const newDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
            setCurrentDate(newDate)
            setIsDarkMode(newDate.getHours() >= 18 || newDate.getHours() < 6)
        }, 5000) // Change day every 5 seconds for demonstration

        return () => clearInterval(interval)
    }, [currentDate])

    const handleGrowthProgress = () => {
        if (growthStage < 3) {
            setGrowthStage(growthStage + 1)
            const newData = [...growthData]
            newData[growthStage + 1].height += Math.floor(Math.random() * 10) + 5
            setGrowthData(newData)
        }
    }

    const handleFertilizerRecommendation = () => {
        // This is a mock recommendation. In a real application, you'd use a more sophisticated algorithm or API.
        setFertilizerRecommendation(`Based on the input parameters, we recommend applying a balanced NPK fertilizer with a ratio of 10-10-10 at a rate of 5 kg per hectare.`)
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setImageFunction: React.Dispatch<React.SetStateAction<string | null>>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImageFunction(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleCameraCapture = (setImageFunction: React.Dispatch<React.SetStateAction<string | null>>) => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                const video = document.createElement('video')
                video.srcObject = stream
                video.play()

                const canvas = document.createElement('canvas')
                canvas.width = 640
                canvas.height = 480

                setTimeout(() => {
                    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
                    const imageDataUrl = canvas.toDataURL('image/jpeg')
                    setImageFunction(imageDataUrl)

                    const tracks = stream.getTracks()
                    tracks.forEach((track) => track.stop())
                }, 100)
            })
        }
    }

    return (
        <div className={`min-h-screen p-8 transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto"
            >
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Plant Growth Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">{format(currentDate, "PPP")}</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={currentDate}
                                    onSelect={(date) => date && setCurrentDate(date)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {isDarkMode ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <EnvironmentCard icon={<Thermometer className="h-4 w-4" />} title="Temperature" value={`${temperature}°C`} range="20-26°C" />
                    <EnvironmentCard icon={<Droplet className="h-4 w-4" />} title="Humidity" value={`${humidity}%`} range="60-70%" />
                    <EnvironmentCard icon={<Sun className="h-4 w-4" />} title="Light Intensity" value="600 μmol/m²/s" range="400-600 μmol/m²/s" />
                    <EnvironmentCard icon={<Wind className="h-4 w-4" />} title="CO2 Level" value="800 ppm" range="800-1200 ppm" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Growth Prediction</CardTitle>
                            <CardDescription>Plant height over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="height" stroke="#10b981" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="mt-4 flex justify-between items-center">
                                <Badge variant="outline">Current Stage: Week {growthStage + 1}</Badge>
                                <Button onClick={handleGrowthProgress} disabled={growthStage >= 3}>
                                    <Sprout className="mr-2 h-4 w-4" /> Progress Growth
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Disease Detection</CardTitle>
                            <CardDescription>Upload or capture an image for analysis</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                                {diseaseImage ? (
                                    <img src={diseaseImage} alt="Uploaded plant" className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <>
                                        <Button onClick={() => fileInputRef.current?.click()}>Upload Image</Button>
                                        <Button className="mt-2" onClick={() => handleCameraCapture(setDiseaseImage)}>
                                            <Camera className="mr-2 h-4 w-4" /> Capture Image
                                        </Button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, setDiseaseImage)}
                                        />
                                        <p className="mt-2 text-sm text-gray-500">Drag and drop, upload, or capture an image</p>
                                    </>
                                )}
                            </div>
                            <Alert className="mt-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>No diseases detected</AlertTitle>
                                <AlertDescription>
                                    Your plants appear to be healthy. Keep up the good work!
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Environmental Control</CardTitle>
                        <CardDescription>Manage your plant's environment</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="water">
                            <TabsList>
                                <TabsTrigger value="water">Water</TabsTrigger>
                                <TabsTrigger value="light">Light</TabsTrigger>
                                <TabsTrigger value="nutrients">Nutrients</TabsTrigger>
                            </TabsList>
                            <TabsContent value="water">
                                <div className="flex items-center space-x-2">
                                    <Slider
                                        value={[waterLevel]}
                                        onValueChange={(value) => setWaterLevel(value[0])}
                                        max={100}
                                        step={1}
                                    />
                                    <span>{waterLevel}%</span>
                                </div>
                                <Button className="mt-4">Apply Water</Button>
                            </TabsContent>
                            <TabsContent value="light">Light control options here</TabsContent>
                            <TabsContent value="nutrients">Nutrient control options here</TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fertilizer Recommendation System</CardTitle>
                            <CardDescription>Enter crop parameters for fertilizer recommendations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="temperature">Temperature (°C)</Label>
                                    <Input
                                        id="temperature"
                                        type="number"
                                        value={temperature}
                                        onChange={(e) => setTemperature(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="humidity">Humidity (%)</Label>
                                    <Input
                                        id="humidity"
                                        type="number"
                                        value={humidity}
                                        onChange={(e) => setHumidity(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="moisture">Moisture (%)</Label>
                                    <Input
                                        id="moisture"
                                        type="number"
                                        value={moisture}
                                        onChange={(e) => setMoisture(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="soilType">Soil Type</Label>
                                    <Select value={soilType} onValueChange={setSoilType}>
                                        <SelectTrigger id="soilType">
                                            <SelectValue placeholder="Select soil type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="clay">Clay</SelectItem>
                                            <SelectItem value="sandy">Sandy</SelectItem>
                                            <SelectItem value="loamy">Loamy</SelectItem>
                                            <SelectItem value="silt">Silt</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cropType">Crop Type</Label>
                                    <Select value={cropType} onValueChange={setCropType}>
                                        <SelectTrigger id="cropType">
                                            <SelectValue placeholder="Select crop type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="wheat">Wheat</SelectItem>
                                            <SelectItem value="rice">Rice</SelectItem>
                                            <SelectItem value="corn">Corn</SelectItem>
                                            <SelectItem value="soybean">Soybean</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nitrogen">Nitrogen (kg/ha)</Label>
                                    <Input
                                        id="nitrogen"
                                        type="number"
                                        value={nitrogen}
                                        onChange={(e) => setNitrogen(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phosphorous">Phosphorous (kg/ha)</Label>
                                    <Input
                                        id="phosphorous"
                                        type="number"
                                        value={phosphorous}
                                        onChange={(e) => setPhosphorous(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <Button className="mt-4 w-full" onClick={handleFertilizerRecommendation}>
                                Get Fertilizer Recommendation
                            </Button>
                            {fertilizerRecommendation && (
                                <Alert className="mt-4">
                                    <AlertTitle>Fertilizer Recommendation</AlertTitle>
                                    <AlertDescription>{fertilizerRecommendation}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pest Detection</CardTitle>
                            <CardDescription>Upload or capture an image to detect pests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                                {pestImage ? (
                                    <img src={pestImage} alt="Uploaded plant for pest detection" className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <>
                                        <Button onClick={() => pestFileInputRef.current?.click()}>Upload Image</Button>
                                        <Button className="mt-2" onClick={() => handleCameraCapture(setPestImage)}>
                                            <Camera className="mr-2 h-4 w-4" /> Capture Image
                                        </Button>
                                        <input
                                            type="file"
                                            ref={pestFileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, setPestImage)}
                                        />
                                        <p className="mt-2 text-sm text-gray-500">Drag and drop, upload, or capture an image</p>
                                    </>
                                )}
                            </div>
                            <Alert className="mt-4">
                                <Bug className="h-4 w-4" />
                                <AlertTitle>Pest Analysis Result</AlertTitle>
                                <AlertDescription>
                                    No pests detected. Your plants appear to be pest-free.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Resource Optimization</CardTitle>
                        <CardDescription>Monitor and optimize resource usage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <ResourceBar title="Water Usage" value={65} />
                            <ResourceBar title="Nutrient Levels" value={80} />
                            <ResourceBar title="Energy Efficiency" value={90} />
                        </div>
                        <div className="mt-6 flex justify-between">
                            <Button>Generate Optimization Report</Button>
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Link href={'/soil'}>
                                        <Button variant="outline">
                                            <Soup className="mr-2 h-4 w-4" /> Soil Analysis
                                        </Button>
                                    </Link>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                    <h3 className="font-semibold mb-2">Soil Health</h3>
                                    <p>pH: 6.5 (Optimal)</p>
                                    <p>Nitrogen: 1.2% (Good)</p>
                                    <p>Phosphorus: 0.8% (Adequate)</p>
                                    <p>Potassium: 1.5% (Excellent)</p>
                                    <Button className="mt-2" onClick={() => alert("Redirecting to Soil Page")}>View Details</Button>
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

function EnvironmentCard({ icon, title, value, range }: { icon: React.ReactNode, title: string, value: string, range: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">Optimal range: {range}</p>
            </CardContent>
        </Card>
    )
}

function ResourceBar({ title, value }: { title: string, value: number }) {
    return (
        <div>
            <div className="flex justify-between mb-1">
                <h3 className="font-semibold">{title}</h3>
                <span>{value}%</span>
            </div>
            <Progress value={value} className="h-2" />
        </div>
    )
}