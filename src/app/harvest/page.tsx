'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Droplet, Thermometer, Wind, AlertTriangle, Loader, Sprout,CircleAlert, Scale, Calendar, FileDown, Leaf, CloudRain, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const initialGrowthData = [
  { week: 'Week 1', height: 5, expectedYield: 0 },
  { week: 'Week 2', height: 10, expectedYield: 0 },
  { week: 'Week 3', height: 18, expectedYield: 0 },
  { week: 'Week 4', height: 25, expectedYield: 50 },
  { week: 'Week 5', height: 35, expectedYield: 100 },
  { week: 'Week 6', height: 45, expectedYield: 150 },
  { week: 'Week 7', height: 55, expectedYield: 200 },
  { week: 'Week 8', height: 65, expectedYield: 250 },
]

const resourceData = [
  { name: 'Water', usage: 75, color: '#3b82f6' },
  { name: 'Light', usage: 90, color: '#eab308' },
  { name: 'Nutrients', usage: 60, color: '#22c55e' },
]

const weatherForecast = [
  { day: 'Mon', temp: 25, icon: <Sun className="h-6 w-6" /> },
  { day: 'Tue', temp: 27, icon: <Sun className="h-6 w-6" /> },
  { day: 'Wed', temp: 23, icon: <CloudRain className="h-6 w-6" /> },
  { day: 'Thu', temp: 22, icon: <CloudRain className="h-6 w-6" /> },
  { day: 'Fri', temp: 26, icon: <Sun className="h-6 w-6" /> },
]

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [waterLevel, setWaterLevel] = useState(50)
  const [growthStage, setGrowthStage] = useState(0)
  const [growthData, setGrowthData] = useState(initialGrowthData)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [harvestWeight, setHarvestWeight] = useState('')
  const [harvestDate, setHarvestDate] = useState('')
  const [qualityRating, setQualityRating] = useState<number[]>([75])
  const [automationEnabled, setAutomationEnabled] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      setCurrentDate(newDate)
      setIsDarkMode(newDate.getHours() >= 18 || newDate.getHours() < 6)
    }, 5000) // Change day every 5 seconds for demonstration

    return () => clearInterval(interval)
  }, [currentDate])

  const handleGrowthProgress = () => {
    if (growthStage < 7) {
      setGrowthStage(growthStage + 1)
      const newData = [...growthData]
      newData[growthStage + 1].height += Math.floor(Math.random() * 10) + 5
      newData[growthStage + 1].expectedYield += Math.floor(Math.random() * 50) + 25
      setGrowthData(newData)
    }
  }

  const handleExportData = () => {
    // Implement export functionality here
    console.log('Exporting farm data...')
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
          <h1 className="text-3xl font-bold">Smart Farm Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">{format(currentDate, "PPP")}</Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={currentDate}
                  onSelect={(date) => date && setCurrentDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Switch
              checked={automationEnabled}
              onCheckedChange={setAutomationEnabled}
              className="ml-4"
            />
            <Label htmlFor="airplane-mode" className="ml-2">Automation</Label>
            {isDarkMode ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <EnvironmentCard icon={<Thermometer className="h-4 w-4" />} title="Temperature" value="24°C" range="20-26°C" />
          <EnvironmentCard icon={<Droplet className="h-4 w-4" />} title="Humidity" value="65%" range="60-70%" />
          <EnvironmentCard icon={<Sun className="h-4 w-4" />} title="Light Intensity" value="600 μmol/m²/s" range="400-600 μmol/m²/s" />
          <EnvironmentCard icon={<Wind className="h-4 w-4" />} title="CO2 Level" value="800 ppm" range="800-1200 ppm" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Crop Growth Prediction</CardTitle>
              <CardDescription>Plant height and expected yield over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="height" stroke="#10b981" strokeWidth={2} name="Height (cm)" />
                  <Line yAxisId="right" type="monotone" dataKey="expectedYield" stroke="#3b82f6" strokeWidth={2} name="Expected Yield (g)" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-between items-center">
                <Badge variant="outline">Current Stage: {growthData[growthStage].week}</Badge>
                <Button onClick={handleGrowthProgress} disabled={growthStage >= 7}>
                  <Sprout className="mr-2 h-4 w-4" /> Progress Growth
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
              <CardDescription>Monitor and optimize farm resources</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={resourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="usage"
                  >
                    {resourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {resourceData.map((resource) => (
                  <div key={resource.name} className="text-center">
                    <div className="font-semibold">{resource.name}</div>
                    <div className="text-2xl font-bold" style={{ color: resource.color }}>{resource.usage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Environmental Control</CardTitle>
              <CardDescription>Manage your crop's environment</CardDescription>
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
                <TabsContent value="light">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Light Intensity</Label>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select intensity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Light Duration (hours)</Label>
                      <Input type="number" className="w-[180px]" placeholder="Enter hours" />
                    </div>
                    <Button>Apply Light Settings</Button>
                  </div>
                </TabsContent>
                <TabsContent value="nutrients">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Nutrient Mix</Label>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select mix" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="nitrogen-rich">Nitrogen Rich</SelectItem>
                          <SelectItem value="phosphorus-rich">Phosphorus Rich</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Application Rate (ml/L)</Label>
                      <Input type="number" className="w-[180px]" placeholder="Enter rate" />
                    </div>
                    <Button>Apply Nutrients</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weather Forecast</CardTitle>
              <CardDescription>5-day local weather prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                {weatherForecast.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="font-semibold">{day.day}</div>
                    {day.icon}
                    <div>{day.temp}°C</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Harvest Log</CardTitle>
              <CardDescription>Record and track your harvests</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="harvestWeight">Harvested Weight (kg)</Label>
                  <Input
                    id="harvestWeight"
                    value={harvestWeight}
                    onChange={(e) => setHarvestWeight(e.target.value)}
                    placeholder="Enter harvested weight"
                  />
                </div>
                <div>
                  <Label htmlFor="harvestDate">Harvest Date</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                  />
                </div>
                <Button type="submit">Log Harvest</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crop Health Assessment</CardTitle>
              <CardDescription>Evaluate the overall quality of your crops</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="qualityRating">Overall Quality Rating</Label>
                  <Slider
                    id="qualityRating"
                    max={100}
                    step={1}
                    value={qualityRating}
                    onValueChange={setQualityRating}
                  />
                  <p className="text-sm text-right">{qualityRating}%</p>
                </div>
                <div>
                  <Label htmlFor="imageUpload">Upload Image for Visual Assessment</Label>
                  <Input id="imageUpload" type="file" accept="image/*" />
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Pest Alert</AlertTitle>
                  <AlertDescription>
                    Potential aphid infestation detected. Consider applying organic pesticides.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Farm Management</CardTitle>
            <CardDescription>Key tasks and information for efficient farm operation</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Upcoming Tasks</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5">
                    <li>Prune tomato plants - Due in 2 days</li>
                    <li>Apply organic fertilizer - Due in 4 days</li>
                    <li>Install new irrigation system - Due in 1 week</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Inventory Status</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Seeds:</span>
                      <span className="font-semibold">Adequate</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fertilizer:</span>
                      <span className="font-semibold text-yellow-500">Low - Reorder Soon</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pest Control:</span>
                      <span className="font-semibold">Adequate</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Equipment Maintenance</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tractor:</span>
                      <span className="font-semibold text-green-500">Serviced</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Irrigation System:</span>
                      <span className="font-semibold text-yellow-500">Check Required</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Greenhouse Fans:</span>
                      <span className="font-semibold text-red-500">Maintenance Overdue</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption</CardTitle>
            <CardDescription>Monitor and optimize your farm's energy usage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: 'Lighting', value: 30 },
                { name: 'Irrigation', value: 20 },
                { name: 'Climate Control', value: 35 },
                { name: 'Automation', value: 15 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                <span>Total Energy: 2500 kWh</span>
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline">Energy Saving Tips</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <h3 className="font-semibold mb-2">Energy Optimization</h3>
                  <ul className="list-disc pl-5">
                    <li>Use LED grow lights</li>
                    <li>Implement smart irrigation systems</li>
                    <li>Optimize climate control schedules</li>
                    <li>Invest in energy-efficient equipment</li>
                  </ul>
                </HoverCardContent>
              </HoverCard>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between items-center">
          <Button onClick={handleExportData}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Farm Data
          </Button>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="outline">
                <CircleAlert className="mr-2 h-4 w-4" /> Soil Health
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <h3 className="font-semibold mb-2">Soil Analysis</h3>
              <p>pH: 6.5 (Optimal)</p>
              <p>Nitrogen: 1.2% (Good)</p>
              <p>Phosphorus: 0.8% (Adequate)</p>
              <p>Potassium: 1.5% (Excellent)</p>
              <Button className="mt-2" onClick={() => alert("Redirecting to Soil Analysis Page")}>View Details</Button>
            </HoverCardContent>
          </HoverCard>
        </div>
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