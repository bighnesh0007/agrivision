"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flower2, Carrot, Apple, Drumstick, Beef, TrendingUp, TrendingDown, Search, ArrowUpDown } from 'lucide-react'

// Data from the provided JSON files (unchanged)
const flowersData = [
  { name: "Anthurium", quantity: "1 Kg", price: 370 },
  { name: "Carnation", quantity: "1 Kg", price: 390 },
  { name: "Jasmine", quantity: "1 Kg", price: 220 },
  { name: "Marigold", quantity: "1 Kg", price: 190 },
  { name: "Orchid", quantity: "1 Kg", price: 430 },
  { name: "Rose", quantity: "1 Kg", price: 230 },
]

const vegetablesData = [
  { name: "Bangalore Tomato", quantity: "1 Kg", price: 80 },
  { name: "Beans", quantity: "1 Kg", price: 180 },
  { name: "Beetroot", quantity: "1 Kg", price: 45 },
  { name: "Bitter Gourd", quantity: "1 Kg", price: 60 },
  { name: "Bottle Gourd", quantity: "1 Kg", price: 20 },
  { name: "Brinjal", quantity: "1 Kg", price: 40 },
]

const fruitsData = [
  { name: "Apple", quantity: "1 Kg", price: 220 },
  { name: "Avocado", quantity: "1 Kg", price: 180 },
  { name: "Black Grape", quantity: "1 Kg", price: 80 },
  { name: "Cherry", quantity: "1 Kg", price: 600 },
  { name: "Coconut", quantity: "1 Piece", price: 30 },
  { name: "Custard Apple", quantity: "1 Kg", price: 140 },
]

const chickenData = [
  { name: "Boneless Chicken", quantity: "1 Kg", price: 210 },
  { name: "Chicken", quantity: "1 Kg", price: 160 },
  { name: "Chicken Liver", quantity: "1 Kg", price: 120 },
  { name: "Country Chicken", quantity: "1 Kg", price: 360 },
  { name: "Live Chicken", quantity: "1 Kg", price: 130 },
  { name: "Skinless Chicken", quantity: "1 Kg", price: 200 },
]

const muttonData = [
  { name: "Boneless Mutton", quantity: "1 Kg", price: 750 },
  { name: "Brain", quantity: "1 Kg", price: 480 },
  { name: "Head", quantity: "1 Piece", price: 240 },
  { name: "Heart", quantity: "1 Kg", price: 470 },
  { name: "Intestine", quantity: "1 Kg", price: 420 },
  { name: "Kidney", quantity: "1 Kg", price: 450 },
]

const categories = [
  { name: 'Flowers', icon: Flower2, data: flowersData, color: 'hsl(var(--chart-1))' },
  { name: 'Vegetables', icon: Carrot, data: vegetablesData, color: 'hsl(var(--chart-2))' },
  { name: 'Fruits', icon: Apple, data: fruitsData, color: 'hsl(var(--chart-3))' },
  { name: 'Chicken', icon: Drumstick, data: chickenData, color: 'hsl(var(--chart-4))' },
  { name: 'Mutton', icon: Beef, data: muttonData, color: 'hsl(var(--chart-5))' },
]

// Generate mock historical data
interface Item {
  name: string;
  quantity: string;
  price: number;
  historicalPrices: { date: string; price: number }[];
}

const generateHistoricalData = (data: Item[], days = 30) => {
  return data.map((item: Item) => {
    const historicalPrices = Array.from({ length: days }, (_, i) => {
      const randomChange = Math.random() * 20 - 10 // Random price change between -10 and 10
      return {
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: Math.max(0, item.price + randomChange)
      }
    })
    return { ...item, historicalPrices: historicalPrices || [] }
  })
}

categories.forEach(category => {
  category.data = generateHistoricalData(category.data).map(item => ({
    ...item,
    historicalPrices: item.historicalPrices || []
  }))
})

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-4 rounded-lg shadow-lg border border-border">
        <p className="font-bold">{label}</p>
        <p className="text-primary">Price: ₹{payload[0].value.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

export default function AdvancedPriceDashboard() {
  const [activeCategory, setActiveCategory] = useState('Flowers')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  const filteredData = useMemo(() => {
    const categoryData = categories.find(c => c.name === activeCategory)?.data || []
    return categoryData
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price)
  }, [activeCategory, searchTerm, sortOrder])

  const averagePrice = useMemo(() => {
    const sum = filteredData.reduce((acc, item) => acc + item.price, 0)
    return (sum / filteredData.length).toFixed(2)
  }, [filteredData])

  const trendData = useMemo(() => {
    return filteredData.map(item => {
      const trend = item.historicalPrices[item.historicalPrices.length - 1].price - item.historicalPrices[0].price;
      return { ...item, trend };
    });
  }, [filteredData])

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8"
      >
        Advanced Price Dashboard
      </motion.h1>

      <Tabs defaultValue="Flowers" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          {categories.map((category) => (
            <TabsTrigger
              key={category.name}
              value={category.name}
              onClick={() => setActiveCategory(category.name)}
              className="flex items-center space-x-2"
            >
              <category.icon className="w-5 h-5" />
              <span>{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
          <Badge variant="secondary" className="text-lg">
            Average Price: ₹{averagePrice}
          </Badge>
        </div>

        {categories.map((category) => (
          <TabsContent key={category.name} value={category.name}>
            <Card>
              <CardHeader>
                <CardTitle>{category.name} Price Trends</CardTitle>
                <CardDescription>Latest prices and trends for various {category.name.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="price"
                        fill={category.color}
                        animationBegin={0}
                        animationDuration={1500}
                      >
                        {trendData.map((entry, index) => (
                          <motion.rect
                            key={`bar-${index}`}
                            initial={{ y: 400 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData[0]?.historicalPrices || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="price" stroke={category.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>{activeCategory} Price List</CardTitle>
            <CardDescription>Detailed price list and trends for {activeCategory.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Quantity</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredData.map((item, index) => (
                      <motion.tr
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b"
                      >
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">₹ {item.price.toFixed(2)}</td>
                        <td className="p-2">
                          {item.trend > 0 ? (
                            <span className="text-green-500 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              {item.trend.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-red-500 flex items-center">
                              <TrendingDown className="w-4 h-4 mr-1" />
                              {Math.abs(item.trend).toFixed(2)}
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}