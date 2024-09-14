"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import Image from "next/image"
import { PlayCircleIcon, CloudSun, Sprout, BarChart, Leaf, Droplet, Sun, Wind, Badge } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { SparklesCore } from '@/components/ui/sparkles'
// import Marquee from '@/components/magicui/marquee'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { MacbookScroll } from '@/components/ui/macbook-scroll'
import createGlobe from "cobe"
import { FloatingDockDemo } from './FloatingDock'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { GoogleGeminiEffect } from '@/components/ui/google-gemini-effect'

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm dark:text-white/80">{body}</blockquote>
    </motion.figure>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="h-full bg-white dark:bg-gray-800">
      <CardContent className="flex flex-col items-center text-center p-6">
        {icon}
        <h3 className="mt-4 font-semibold text-lg text-gray-800 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

const cropYieldData = [
  { year: '2018', yield: 4200 },
  { year: '2019', yield: 4500 },
  { year: '2020', yield: 4800 },
  { year: '2021', yield: 5100 },
  { year: '2022', yield: 5400 },
  { year: '2023', yield: 5700 },
]

const LandingPage = () => {
  const [progress, setProgress] = useState(13)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])
  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2])
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2])
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2])
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2])
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2])
  const reviews = [
    {
      name: "Jack",
      username: "@jack",
      body: "AgriAI has revolutionized my farming practices. The crop analysis is spot on!",
      img: "https://avatar.vercel.sh/jack",
    },
    {
      name: "Sarah",
      username: "@sarahfarmer",
      body: "The weather predictions are incredibly accurate. It's saved my crops more than once.",
      img: "https://avatar.vercel.sh/sarah",
    },
    {
      name: "Mike",
      username: "@mikeagronomist",
      body: "The yield optimization suggestions have increased my productivity by 30%.",
      img: "https://avatar.vercel.sh/mike",
    },
    {
      name: "Emily",
      username: "@emilyorganic",
      body: "Market insights from AgriAI have helped me make informed decisions about what to grow.",
      img: "https://avatar.vercel.sh/emily",
    },
    {
      name: "David",
      username: "@davidtechfarmer",
      body: "The AI-powered pest detection has saved me thousands in potential crop losses.",
      img: "https://avatar.vercel.sh/david",
    },
    {
      name: "Lisa",
      username: "@lisasustainable",
      body: "AgriAI's soil health analysis has dramatically improved my land's fertility.",
      img: "https://avatar.vercel.sh/lisa",
    },
  ]

  const firstRow = reviews.slice(0, reviews.length / 2)
  const secondRow = reviews.slice(reviews.length / 2)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <BackgroundBeams />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-green-500 z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <h1 className="text-5xl font-bold text-green-800 dark:text-green-200 mb-4">
            <TextGenerateEffect words="AgriVision: Cultivating Tomorrow" />
          </h1>
          <p className="text-xl text-green-600 dark:text-green-400 mb-8">Empowering farmers with cutting-edge AI solutions</p>
          <Link href={'/home'}>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
              Explore AgriVision
            </Button>
          </Link>
        </motion.div>

        <div className="w-[40rem] h-40 relative mt-8">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#22c55e"
          />
        </div>
        <BackgroundBeams />
      </section>

      <SkeletonFour />

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<PlayCircleIcon className="h-10 w-10 text-green-500" />}
            title="AI-Powered Crop Analysis"
            description="Utilize machine learning for precise crop health assessment and growth prediction."
          />
          <FeatureCard
            icon={<CloudSun className="h-10 w-10 text-green-500" />}
            title="Advanced Weather Forecasting"
            description="Access hyper-local weather predictions to optimize your farming schedule."
          />
          <FeatureCard
            icon={<Sprout className="h-10 w-10 text-green-500" />}
            title="Yield Optimization"
            description="Maximize your harvest with AI-driven planting and cultivation strategies."
          />
          <FeatureCard
            icon={<BarChart className="h-10 w-10 text-green-500" />}
            title="Real-time Market Insights"
            description="Stay ahead with AI-analyzed market trends and demand forecasts."
          />
        </div>
      </section>
      <MacbookScroll
        title={
          <span>
            This Macbook is built with Tailwindcss. <br /> No kidding.
          </span>
        }
        badge={
          <Link href="https://peerlist.io/manuarora">
            <Badge className="h-10 w-10 transform -rotate-12" />
          </Link>
        }
        src={"/images/macbook.png"}
        showGradient={false}
      />
      {/* Data Visualization Section */}
      {/* <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-8 text-green-800 dark:text-green-200"
          >
            AgriAI Impact on Crop Yield
          </motion.h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cropYieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="yield" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section> */}
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                Unleash the power of <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  Scroll Animations
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={"/placeholder.svg?height=720&width=1400"}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
      {/* AI Insights Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-8 text-green-800 dark:text-green-200"
          >
            AI-Powered Farming Insights
          </motion.h2>
          <Tabs defaultValue="soil" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="soil">Soil Health</TabsTrigger>
              <TabsTrigger value="water">Water Management</TabsTrigger>
              <TabsTrigger value="pests">Pest Control</TabsTrigger>
              <TabsTrigger value="nutrients">Nutrient Optimization</TabsTrigger>
            </TabsList>
            <TabsContent value="soil">
              <Card>
                <CardContent className="flex items-center p-6">
                  <Leaf className="h-10 w-10 text-green-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Soil Health Score</h3>
                    <Progress value={progress} className="w-[60%]" />
                    <p className="mt-2">Your soil health is improving. Consider adding more organic matter for optimal results.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="water">
              <Card>
                <CardContent className="flex items-center p-6">
                  <Droplet className="h-10 w-10 text-blue-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Water Efficiency</h3>
                    <Progress value={78} className="w-[60%]" />
                    <p className="mt-2">Your water usage is efficient. Consider implementing drip irrigation for even better results.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pests">
              <Card>
                <CardContent className="flex items-center p-6">
                  <Sun className="h-10 w-10 text-yellow-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Pest Risk Level</h3>
                    <Progress value={22} className="w-[60%]" />
                    <p className="mt-2">Low pest risk detected. Continue monitoring and consider introducing beneficial insects.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="nutrients">
              <Card>
                <CardContent className="flex items-center p-6">
                  <Wind className="h-10 w-10 text-purple-500 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Nutrient Balance</h3>
                    <Progress value={85} className="w-[60%]" />
                    <p className="mt-2">Your crops are well-nourished. Consider a soil test to fine-tune your fertilization strategy.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <GoogleGeminiEffect pathLengths={[
        pathLengthFirst,
        pathLengthSecond,
        pathLengthThird,
        pathLengthFourth,
        pathLengthFifth,
      ]} />
      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-600 dark:bg-green-700 relative">
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Ready to revolutionize your farming?
          </motion.h2>
          <p className="mb-8">Join thousands of farmers already benefiting from AgriAI's cutting-edge solutions.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Input placeholder="Enter your email" className="max-w-xs text-black" />
            <Button variant="secondary" className="bg-white text-green-600 hover:bg-green-100">Get Personalized Demo</Button>
          </div>
        </div>
      </section>


      {/* <FloatingDockDemo /> */}


      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">AgriAI</h3>
            <p className="mt-2 text-sm">Empowering farmers with intelligent solutions</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-green-300">About</a>
            <a href="#" className="hover:text-green-300">Services</a>
            <a href="#" className="hover:text-green-300">Contact</a>
            <a href="#" className="hover:text-green-300">Blog</a>
            <a href="#" className="hover:text-green-300">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
      <Globe className="absolute -left-50 md:-left-15 -bottom-40 md:-bottom-40" />
    </div>
  )
}

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let phi = 0

    if (!canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.0060], size: 0.1 },
      ],
      onRender: (state) => {
        state.phi = phi
        phi += 0.01
      },
    })

    return () => {
      globe.destroy()
    }
  }, [])

  return (
    <div className={cn("h-[600px] w-[600px]", className)}>
      <canvas
        ref={canvasRef}
        style={{
          width: 600,
          height: 600,
          maxWidth: "100%",
          aspectRatio: 1,
        }}
      />
    </div>
  )
}