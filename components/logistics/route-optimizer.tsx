"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Route, Clock, Fuel, Truck, Navigation, Zap } from "lucide-react"

interface RouteStop {
  id: string
  address: string
  city: string
  type: "pickup" | "delivery"
  priority: "high" | "medium" | "low"
  timeWindow?: {
    start: string
    end: string
  }
}

interface OptimizedRoute {
  stops: RouteStop[]
  totalDistance: number
  totalDuration: number
  estimatedFuel: number
  estimatedCost: number
}

export function RouteOptimizer() {
  const [stops, setStops] = useState<RouteStop[]>([])
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

  // Mock route optimization (in real app, this would call Google Maps API)
  const optimizeRoute = async () => {
    setIsOptimizing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock optimization logic
    const shuffledStops = [...stops].sort(() => Math.random() - 0.5)
    const totalDistance = Math.round(Math.random() * 100 + 50) // 50-150 km
    const totalDuration = Math.round(totalDistance * 1.5 + Math.random() * 30) // Estimate based on distance
    const estimatedFuel = Math.round(totalDistance * 0.08 * 100) / 100 // 8L/100km
    const estimatedCost = Math.round(estimatedFuel * 700) // ₦700 per liter

    setOptimizedRoute({
      stops: shuffledStops,
      totalDistance,
      totalDuration,
      estimatedFuel,
      estimatedCost,
    })

    setIsOptimizing(false)
  }

  const addStop = () => {
    const newStop: RouteStop = {
      id: Date.now().toString(),
      address: "",
      city: "",
      type: "delivery",
      priority: "medium",
    }
    setStops([...stops, newStop])
  }

  const updateStop = (id: string, updates: Partial<RouteStop>) => {
    setStops(stops.map((stop) => (stop.id === id ? { ...stop, ...updates } : stop)))
  }

  const removeStop = (id: string) => {
    setStops(stops.filter((stop) => stop.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Route Optimizer</h2>
        <p className="text-gray-600">Plan efficient delivery routes to minimize time and fuel costs</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Route Planning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Route Planning
            </CardTitle>
            <CardDescription>Add stops and optimize your delivery route</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stops List */}
            <div className="space-y-3">
              {stops.map((stop, index) => (
                <div key={stop.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <select
                        value={stop.type}
                        onChange={(e) => updateStop(stop.id, { type: e.target.value as "pickup" | "delivery" })}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="pickup">Pickup</option>
                        <option value="delivery">Delivery</option>
                      </select>
                      <select
                        value={stop.priority}
                        onChange={(e) => updateStop(stop.id, { priority: e.target.value as "high" | "medium" | "low" })}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => removeStop(stop.id)}>
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`address-${stop.id}`} className="text-xs">
                        Address
                      </Label>
                      <Input
                        id={`address-${stop.id}`}
                        placeholder="Enter address"
                        value={stop.address}
                        onChange={(e) => updateStop(stop.id, { address: e.target.value })}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`city-${stop.id}`} className="text-xs">
                        City
                      </Label>
                      <Input
                        id={`city-${stop.id}`}
                        placeholder="Enter city"
                        value={stop.city}
                        onChange={(e) => updateStop(stop.id, { city: e.target.value })}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={addStop} variant="outline" className="flex-1 bg-transparent">
                <MapPin className="h-4 w-4 mr-2" />
                Add Stop
              </Button>
              <Button
                onClick={optimizeRoute}
                disabled={stops.length < 2 || isOptimizing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isOptimizing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Route className="h-4 w-4 mr-2" />
                    Optimize Route
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Optimized Route Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Navigation className="h-5 w-5 mr-2" />
              Optimized Route
            </CardTitle>
            <CardDescription>Your most efficient delivery route</CardDescription>
          </CardHeader>
          <CardContent>
            {!optimizedRoute ? (
              <div className="text-center py-8">
                <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Add at least 2 stops and click "Optimize Route" to see results</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Route Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center text-blue-600 mb-1">
                      <Route className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Distance</span>
                    </div>
                    <p className="text-lg font-bold text-blue-800">{optimizedRoute.totalDistance} km</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center text-green-600 mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Duration</span>
                    </div>
                    <p className="text-lg font-bold text-green-800">{optimizedRoute.totalDuration} min</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center text-orange-600 mb-1">
                      <Fuel className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Fuel</span>
                    </div>
                    <p className="text-lg font-bold text-orange-800">{optimizedRoute.estimatedFuel}L</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center text-purple-600 mb-1">
                      <Truck className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Cost</span>
                    </div>
                    <p className="text-lg font-bold text-purple-800">{formatPrice(optimizedRoute.estimatedCost)}</p>
                  </div>
                </div>

                <Separator />

                {/* Optimized Stop Order */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Optimized Stop Order</h4>
                  {optimizedRoute.stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant={stop.type === "pickup" ? "default" : "secondary"}>
                            {stop.type === "pickup" ? "Pickup" : "Delivery"}
                          </Badge>
                          <Badge className={getPriorityColor(stop.priority)}>{stop.priority}</Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{stop.address || "Address not specified"}</p>
                        <p className="text-xs text-gray-500">{stop.city || "City not specified"}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Navigation className="h-4 w-4 mr-2" />
                  Start Navigation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
