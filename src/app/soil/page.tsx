'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, Sun, Moon, CloudRain, Cloud, Droplet, Thermometer, Wind, CheckCircle, XCircle, Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from 'date-fns'
import Link from 'next/link'

type Task = {
  id: string
  date: Date
  type: string
  notes: string
  completed: boolean
}

type HarvestCondition = {
  id: string
  label: string
  checked: boolean
}

const MotionCard = motion(Card)

export default function EnhancedFarmDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [moisture, setMoisture] = useState(50)
  const [temperature, setTemperature] = useState(25)
  const [windSpeed, setWindSpeed] = useState(5)
  const [weather, setWeather] = useState('Sunny')
  const [isDaytime, setIsDaytime] = useState(true)
  const [isWatered, setIsWatered] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Task>({ id: '', date: new Date(), type: 'Water', notes: '', completed: false })
  const [showAddTask, setShowAddTask] = useState(false)
  const [alerts, setAlerts] = useState<string[]>([])
  const [canHarvest, setCanHarvest] = useState(false)
  const [showHarvestDialog, setShowHarvestDialog] = useState(false)
  const [harvestConditions, setHarvestConditions] = useState<HarvestCondition[]>([
    { id: '1', label: 'Crop maturity reached', checked: false },
    { id: '2', label: 'Optimal weather conditions', checked: false },
    { id: '3', label: 'Equipment ready', checked: false },
    { id: '4', label: 'Labor available', checked: false },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      setIsDaytime(now.getHours() >= 6 && now.getHours() < 18)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const weathers = ['Sunny', 'Cloudy', 'Rainy']
      setWeather(weathers[Math.floor(Math.random() * weathers.length)])
      setMoisture(prevMoisture => Math.max(0, Math.min(100, prevMoisture + Math.random() * 10 - 5)))
      setTemperature(prevTemp => Math.max(0, Math.min(40, prevTemp + Math.random() * 4 - 2)))
      setWindSpeed(prevSpeed => Math.max(0, Math.min(30, prevSpeed + Math.random() * 3 - 1.5)))

      const newAlerts = []
      if (moisture < 30) newAlerts.push("Low soil moisture! Consider watering soon.")
      if (temperature > 35) newAlerts.push("High temperature alert! Ensure plants are protected.")
      if (windSpeed > 20) newAlerts.push("Strong winds detected. Check for any damage to crops.")
      setAlerts(newAlerts)

      checkHarvestingConditions()
    }, 10000)

    return () => clearInterval(weatherInterval)
  }, [moisture, temperature, windSpeed])

  const getWeatherIcon = () => {
    switch (weather) {
      case 'Sunny': return <Sun className="h-6 w-6 text-yellow-500" />
      case 'Cloudy': return <Cloud className="h-6 w-6 text-gray-500" />
      case 'Rainy': return <CloudRain className="h-6 w-6 text-blue-500" />
      default: return null
    }
  }

  const handleAddTask = () => {
    if (newTask.date && newTask.type) {
      setTasks([...tasks, { ...newTask, id: Date.now().toString() }])
      setNewTask({ id: '', date: new Date(), type: 'Water', notes: '', completed: false })
      setShowAddTask(false)
    }
  }

  const checkHarvestingConditions = () => {
    const allConditionsMet = harvestConditions.every(condition => condition.checked)
    setCanHarvest(allConditionsMet)
  }

  const handleHarvest = () => {
    console.log("Harvesting initiated!")
    setShowHarvestDialog(false)
  }

  const handleConditionChange = (id: string, checked: boolean) => {
    setHarvestConditions(prevConditions =>
      prevConditions.map(condition =>
        condition.id === id ? { ...condition, checked } : condition
      )
    )
    checkHarvestingConditions()
  }

  const getTasksForSelectedDate = () => {
    return tasks.filter(task =>
      task.date.toDateString() === selectedDate?.toDateString()
    )
  }

  const handleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 rounded-md">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-green-800 dark:text-green-200"
        >
          Enhanced Farm Dashboard
        </motion.h1>

        <AnimatePresence>
          {alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Alerts</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {alerts.map((alert, index) => (
                      <li key={index}>{alert}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <MotionCard variants={cardVariants} initial="hidden" animate="visible">
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">Time:</span>
                <span className="text-xl font-semibold">{currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg">Date:</span>
                <span className="text-xl font-semibold">{currentTime.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg">Weather:</span>
                <div className="flex items-center">
                  {getWeatherIcon()}
                  <span className="ml-2 text-xl font-semibold">{weather}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg">Day/Night:</span>
                {isDaytime ? (
                  <Sun className="h-6 w-6 text-yellow-500" />
                ) : (
                  <Moon className="h-6 w-6 text-blue-900" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Moisture:</span>
                  <span className="text-xl font-semibold">{moisture.toFixed(1)}%</span>
                </div>
                <Progress value={moisture} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Temperature:</span>
                  <div className="flex items-center">
                    <Thermometer className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-xl font-semibold">{temperature.toFixed(1)}°C</span>
                  </div>
                </div>
                <Progress value={(temperature / 40) * 100} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Wind Speed:</span>
                  <div className="flex items-center">
                    <Wind className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-xl font-semibold">{windSpeed.toFixed(1)} km/h</span>
                  </div>
                </div>
                <Progress value={(windSpeed / 30) * 100} className="w-full" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="watered"
                  checked={isWatered}
                  onCheckedChange={(checked) => setIsWatered(checked as boolean)}
                />
                <Label htmlFor="watered" className="text-lg">
                  Plants watered today
                </Label>
              </div>
            </CardContent>
          </MotionCard>

          <MotionCard variants={cardVariants} initial="hidden" animate="visible" className="md:col-span-2">
            <CardHeader>
              <CardTitle>Farm Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="calendar">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>
                <TabsContent value="calendar" className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Tasks for {selectedDate?.toDateString()}</h3>
                      <ul className="space-y-2">
                        {getTasksForSelectedDate().map(task => (
                          <motion.li
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center justify-between space-x-2 bg-white dark:bg-gray-800 p-2 rounded-md shadow"
                          >
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => handleTaskCompletion(task.id)}
                              />
                              <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                {task.type}:
                              </span>
                              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                {task.notes}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
                    <DialogTrigger asChild>
                      <Button>Add Task</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>Create a new task for your farm management.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="task-date" className="text-right">
                            Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={`w-[280px] justify-start text-left font-normal col-span-3 ${
                                  newTask.date ? "text-gray-900" : "text-gray-500"
                                }`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newTask.date ? format(newTask.date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newTask.date}
                                onSelect={(date) => setNewTask({ ...newTask, date: date || new Date() })}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="task-type" className="text-right">
                            Type
                          </Label>
                          <Select
                            value={newTask.type}
                            onValueChange={(value) => setNewTask({ ...newTask, type: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select task type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Water">Water</SelectItem>
                              <SelectItem value="Fertilize">Fertilize</SelectItem>
                              <SelectItem value="Harvest">Harvest</SelectItem>
                              <SelectItem value="Pest Control">Pest Control</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="task-notes" className="text-right">
                            Notes
                          </Label>
                          <Textarea
                            id="task-notes"
                            value={newTask.notes}
                            onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddTask}>Add Task</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TabsContent>
                <TabsContent value="tasks">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map(task => (
                        <TableRow key={task.id}>
                          <TableCell>{task.date.toLocaleDateString()}</TableCell>
                          <TableCell>{task.type}</TableCell>
                          <TableCell>{task.notes}</TableCell>
                          <TableCell>
                            {task.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTaskCompletion(task.id)}
                            >
                              {task.completed ? 'Undo' : 'Complete'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </MotionCard>
        </div>

        <MotionCard variants={cardVariants} initial="hidden" animate="visible">
          <CardHeader>
            <CardTitle>Crop Management Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg">
                Based on current conditions:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>{moisture < 30 ? "Soil is dry. Consider watering soon." : "Soil moisture is adequate."}</li>
                <li>{weather === 'Rainy' ? "Rain expected. Natural watering in progress." : "No rain expected. Monitor soil moisture closely."}</li>
                <li>{isDaytime ? "Daytime: Avoid watering to prevent leaf burn." : "Nighttime: Good time for watering if needed."}</li>
                <li>{temperature > 30 ? "High temperature. Ensure plants are protected and well-hydrated." : "Temperature is suitable for most crops."}</li>
                <li>{windSpeed > 15 ? "Strong winds. Check for any damage to crops and provide support if necessary." : "Wind conditions are normal."}</li>
              </ul>
              <div className="mt-4 flex items-center space-x-2">
                <Droplet className="h-5 w-5 text-blue-500" />
                <span className="text-lg font-semibold">
                  {isWatered ? "Plants have been watered today." : "Plants have not been watered today."}
                </span>
              </div>
            </div>
          </CardContent>
        </MotionCard>

        <MotionCard variants={cardVariants} initial="hidden" animate="visible">
          <CardHeader>
            <CardTitle>Harvest Readiness Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {harvestConditions.map(condition => (
                <div key={condition.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition.id}
                    checked={condition.checked}
                    onCheckedChange={(checked) => handleConditionChange(condition.id, checked as boolean)}
                  />
                  <Label htmlFor={condition.id}>{condition.label}</Label>
                </div>
              ))}
              {canHarvest && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={'/harvest'}>
                    <Button onClick={() => console.log("All conditions met. Ready for harvest!")}>
                      Confirm Harvest Readiness
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </CardContent>
        </MotionCard>
      </div>
    </div>
  )
}