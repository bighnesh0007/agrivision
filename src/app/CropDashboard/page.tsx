'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell as RechartsTooltip, Cell } from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Thermometer, Droplet, Sun, Wind, Zap, MapPin, TrendingUp, ShieldCheck, Leaf, Users, AlertTriangle, BookOpen } from 'lucide-react'

export default function CropDashboard() {
  const [cropData, setCropData] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendation, setRecommendation] = useState<any | null>(null)
  const [waterConsumption, setWaterConsumption] = useState<any | null>(null)
  const [electricConsumption, setElectricConsumption] = useState<any | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setRecommendation(null)
    try {
      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cropData }),
      })


      if (!response.ok) {
        throw new Error('Failed to get crop recommendations')
      }
      const data = await response.json()
      setRecommendation(data.recommendation)
      console.log(data.recommendation)

      const waterResponse = await fetch(`/api/water-consumption?crop=${cropData}`)
      if (waterResponse.ok) {
        const waterData = await waterResponse.json()
        setWaterConsumption(waterData)
        console.log(waterData)
      }

      const electricResponse = await fetch(`/api/electric-consumption?crop=${cropData}`)
      if (electricResponse.ok) {
        const electricData = await electricResponse.json()
        setElectricConsumption(electricData)
        console.log(electricData)
      }


    } catch (err) {
      console.error('Error:', err)
      setError('Failed to get crop recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const parseRecommendation = (text: string): Record<string, any> => {
    const sections = text.split('###').filter(section => section.trim() !== '')
    return sections.reduce((acc: Record<string, any>, section: string) => {
      const [title, ...content] = section.split('\n');
      const key = title.trim().replace(/^\d+\.\s*/, '').replace(/:/g, '');
      let value = content.join('\n').trim();

      // Remove asterisks, clean up the text, and preserve newlines
      value = value
        .replace(/\*/g, '')                        // Remove all asterisks
        .split('\n')                               // Split by newlines
        .map(line => line.trim())                  // Trim each line
        .filter(Boolean)                           // Remove empty lines
        .join('\n');                               // Join with '\n' to keep new lines

      acc[key] = value
      console.log(key, value);
      return acc
    }, {})
  }

  const parsedRecommendation = recommendation ? parseRecommendation(recommendation) : null

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold mb-6">Crop Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Enter Crop Data</CardTitle>
          <CardDescription>Get personalized recommendations for your crop</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter crop name..."
                value={cropData}
                onChange={(e) => setCropData(e.target.value)}
                required
                className="flex-grow"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600">
                      {loading ? 'Loading...' : 'Get Recommendations'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to get personalized crop recommendations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </form>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : parsedRecommendation ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Thermometer className="mr-2" /> Best Conditions for Crop</CardTitle>
            </CardHeader>
            <CardContent>
              {parsedRecommendation['Best Conditions for Crop'].split('\n').map((line: string, index: number) => (
                <p key={index} className="mb-2">{line}</p>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><TrendingUp className="mr-2" /> Current Price in Market</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">{parsedRecommendation['Current Price in Market']}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Sun className="mr-2" /> Best Weather</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{parsedRecommendation['Best Weather']}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Droplet className="mr-2" /> pH Level</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{parsedRecommendation['pH Level']}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><ShieldCheck className="mr-2" /> Tips to Protect</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {parsedRecommendation['Tips to Protect'].split('\n').map((tip: string, index: number) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Droplet className="mr-2" /> Water Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart">
                <TabsList>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                <TabsContent value="chart">
                  {waterConsumption && Array.isArray(waterConsumption) ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={waterConsumption}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="growth_stage" />
                        <YAxis />
                        {/* <Tooltip /> */}
                        <Legend />
                        <Bar dataKey="water_consumption" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p>Water consumption data is not available in chart format.</p>
                  )}
                </TabsContent>
                <TabsContent value="info">
                  {parsedRecommendation['Water Consumption'].split('\n').map((tip: string, index: number) => (
                    <li key={index}>{tip}</li>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Zap className="mr-2" /> Electric Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart">
                <TabsList>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                <TabsContent value="chart">
                  {electricConsumption && Array.isArray(electricConsumption) ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={electricConsumption}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {electricConsumption.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'][index % 4]} />
                          ))}
                        </Pie>
                        {/* <Tooltip /> */}
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p>Electric consumption data is not available in chart format.</p>
                  )}
                </TabsContent>
                <TabsContent value="info">
                  {parsedRecommendation['Electric Consumption'].split('\n').map((tip: string, index: number) => (
                    <li key={index}>{tip}</li>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><MapPin className="mr-2" /> Best Places to Grow in India</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{parsedRecommendation['Best Places to Grow in India']}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Leaf className="mr-2" /> AI Generated Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{parsedRecommendation['AI Generated Tips']}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Users className="mr-2" /> Top Consumers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{parsedRecommendation['Top Consumers']}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><AlertTriangle className="mr-2" /> Percentage of Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">{parsedRecommendation['Percentage of Risk']}</p>
              <Progress value={parseInt(parsedRecommendation['Percentage of Risk'])} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><BookOpen className="mr-2" /> Blog Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{parsedRecommendation['Blog Cards']}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}