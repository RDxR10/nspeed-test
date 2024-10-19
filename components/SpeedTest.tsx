"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Wifi, Network } from "lucide-react"

const SpeedometerGauge = () => {
  return (
    <div className="relative w-64 h-32 mx-auto flex items-center justify-center">
      <Wifi className="w-16 h-16 text-cyan-500" />
    </div>
  )
}

const SpeedGraph = ({ speeds }: { speeds: number[] }) => {
  return (
    <div className="h-16 w-full bg-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 flex items-end">
        {speeds.map((speed, index) => (
          <div
            key={index}
            className="w-1 bg-gradient-to-t from-cyan-500 to-purple-500 mr-1"
            style={{ height: `${(speed / 2) * 100}%` }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default function SpeedTest() {
  const [downloadSpeed, setDownloadSpeed] = useState(0)
  const [uploadSpeed, setUploadSpeed] = useState(0)
  const [ping, setPing] = useState(0)
  const [testing, setTesting] = useState(false)
  const [speedHistory, setSpeedHistory] = useState<number[]>([])

  const testSpeed = async () => {
    setTesting(true)
    setDownloadSpeed(0)
    setUploadSpeed(0)
    setPing(0)
    setSpeedHistory([])

    try {
      const response = await fetch('http://localhost:8000/speedtest')
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setPing(data.ping)
      setDownloadSpeed(data.download)
      setUploadSpeed(data.upload)
      setSpeedHistory(prev => [...prev, data.download, data.upload])
    } catch (error) {
      console.error("Error during speed test:", error)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950 text-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <ArrowDown className="w-5 h-5 text-cyan-500 mr-2" />
              <span className="text-sm text-gray-400">DOWNLOAD Mbps</span>
            </div>
            <div className="text-4xl font-bold">{downloadSpeed.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-400">UPLOAD Mbps</span>
              <ArrowUp className="w-5 h-5 text-purple-500 ml-2" />
            </div>
            <div className="text-4xl font-bold">{uploadSpeed.toFixed(2)}</div>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <Network className="w-5 h-5 text-cyan-500 mr-2" />
            Ping <span className="text-cyan-500 font-bold ml-1">{ping.toFixed(0)}</span> ms
          </div>
          <div className="flex items-center">
            <ArrowDown className="w-5 h-5 text-cyan-500 mr-2" />
            <span className="text-cyan-500 font-bold">{downloadSpeed.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <ArrowUp className="w-5 h-5 text-purple-500 mr-2" />
            <span className="text-purple-500 font-bold">{uploadSpeed.toFixed(2)}</span>
          </div>
        </div>
        <SpeedGraph speeds={speedHistory.slice(-100)} />
        <SpeedometerGauge />
        <Button
          onClick={testSpeed}
          disabled={testing}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
        >
          {testing ? "Testing..." : "START"}
        </Button>
      </div>
    </div>
  )
}
