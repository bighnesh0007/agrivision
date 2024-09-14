'use client'

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Loader2, Info, Camera, Link } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const getSoilDetails = async (input: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  return {
    type: input,
    found: "Various regions across temperate and tropical climates",
    crops: ["Wheat", "Corn", "Soybeans", "Cotton"],
    ph: "6.0 - 7.0",
    texture: "Loamy",
    organicMatter: "Medium to high",
  }
}

export default function SoilDashboard() {
  const [soilType, setSoilType] = useState('')
  const [soilDetails, setSoilDetails] = useState<any>(null)
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const analyzeSoilType = async () => {
    setLoading(true)
    setError('')
    try {
      const details = await getSoilDetails(soilType)
      setSoilDetails(details)
    } catch (err) {
      setError('Failed to fetch soil details')
    }
    setLoading(false)
  }

  const analyzeImage = useCallback(async (file: File | string) => {
    setLoading(true)
    setError('')
    setImageAnalysis(null)
    setSoilDetails(null)

    try {
      let base64: string
      if (typeof file === 'string') {
        const response = await fetch(file)
        const blob = await response.blob()
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = error => reject(error)
        })
        setPreviewImage(file)
      } else {
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            resolve(reader.result as string)
            setPreviewImage(reader.result as string)
          }
          reader.onerror = error => reject(error)
        })
      }

      const response = await fetch('/api/analyze-soil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze image')
      }

      const data = await response.json()
      setImageAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image')
    }
    setLoading(false)
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      analyzeImage(acceptedFiles[0])
    }
  }, [analyzeImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  })

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError('Failed to access camera')
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480)
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' })
            analyzeImage(file)
          }
        }, 'image/jpeg')
      }
    }
  }

  const analyzeFromUrl = () => {
    if (imageUrl) {
      analyzeImage(imageUrl)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Soil Dashboard</h1>

      <Tabs defaultValue="type" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="type">Soil Type Input</TabsTrigger>
          <TabsTrigger value="image">Image Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="type">
          <Card>
            <CardHeader>
              <CardTitle>Enter Soil Type</CardTitle>
              <CardDescription>Provide the type of soil to get detailed information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); analyzeSoilType(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Input
                    id="soilType"
                    placeholder="e.g., Clay, Sandy, Loam"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                  />
                </div>
                <Button
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Info className="mr-2 h-4 w-4" />}
                  Get Details
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Soil Image</CardTitle>
              <CardDescription>Upload, capture, or provide a URL for a soil image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors">
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the image here ...</p>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p>Drag 'n' drop an image here, or click to select an image</p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    className="z-20 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={startCamera}>
                    <Camera className="mr-2 h-4 w-4" />
                    Open Camera
                  </Button>
                  <Button onClick={capturePhoto}>Capture Photo</Button>
                </div>
                <video ref={videoRef} width="640" height="480" autoPlay muted className="hidden" />
                <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                <div className="flex space-x-2">
                  <Input
                    type="url"
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={analyzeFromUrl}
                  >
                    <Link className="mr-2 h-4 w-4" />
                    Analyze URL
                  </Button>
                </div>
                {previewImage && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Uploaded/Captured Image:</h3>
                    <img src={previewImage} alt="Soil sample" className="max-w-full h-auto rounded-lg shadow-md" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading && (
        <div className="flex justify-center items-center space-x-2 mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Analyzing soil...</p>
        </div>
      )}

      {imageAnalysis && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Image Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{imageAnalysis.replace(/[*#]/g, ' ').trim()}</p>
          </CardContent>
        </Card>
      )}

      {soilDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Soil Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold">Soil Type:</h3>
                <p>{soilDetails.type}</p>
              </div>
              <div>
                <h3 className="font-semibold">Where Found:</h3>
                <p>{soilDetails.found}</p>
              </div>
              <div>
                <h3 className="font-semibold">Suitable Crops:</h3>
                <ul className="list-disc list-inside">
                  {soilDetails.crops.map((crop: string, index: number) => (
                    <li key={index}>{crop}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">pH Range:</h3>
                <p>{soilDetails.ph}</p>
              </div>
              <div>
                <h3 className="font-semibold">Texture:</h3>
                <p>{soilDetails.texture}</p>
              </div>
              <div>
                <h3 className="font-semibold">Organic Matter Content:</h3>
                <p>{soilDetails.organicMatter}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}