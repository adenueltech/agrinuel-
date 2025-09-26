"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Truck, MapPin, Clock, Package, CheckCircle, Navigation, Phone, User, Route } from "lucide-react"

interface Delivery {
  id: string
  order_id: string
  driver_name: string
  driver_phone: string
  vehicle_info: {
    type: string
    plate_number: string
    capacity: string
  }
  pickup_location: {
    address: string
    city: string
    coordinates?: { lat: number; lng: number }
  }
  delivery_location: {
    address: string
    city: string
    coordinates?: { lat: number; lng: number }
  }
  estimated_distance: number
  estimated_duration: number
  status: "assigned" | "picked_up" | "in_transit" | "delivered"
  pickup_time: string | null
  delivery_time: string | null
  created_at: string
  order: {
    id: string
    total_amount: number
    buyer: {
      full_name: string
      phone: string
    }
    product: {
      name: string
      farmer: {
        full_name: string
      }
    }
  }
}

export function DeliveryTracker() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [activeTab, setActiveTab] = useState("active")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const { data } = await supabase
          .from("deliveries")
          .select(
            `
            *,
            order:orders(
              id,
              total_amount,
              buyer:users!orders_buyer_id_fkey(full_name, phone),
              product:products(
                name,
                farmer:users!products_farmer_id_fkey(full_name)
              )
            )
          `,
          )
          .order("created_at", { ascending: false })

        setDeliveries(data || [])
      } catch (error) {
        console.error("Error fetching deliveries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeliveries()

    // Set up real-time subscription
    const subscription = supabase
      .channel("delivery_updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "deliveries" }, () => {
        fetchDeliveries()
      })
      .subscribe()

    return () => subscription.unsubscribe()
  }, [supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-800"
      case "picked_up":
        return "bg-yellow-100 text-yellow-800"
      case "in_transit":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "assigned":
        return 25
      case "picked_up":
        return 50
      case "in_transit":
        return 75
      case "delivered":
        return 100
      default:
        return 0
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price)
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleString("en-NG", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const activeDeliveries = deliveries.filter((d) => d.status !== "delivered")
  const completedDeliveries = deliveries.filter((d) => d.status === "delivered")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-500">Loading deliveries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delivery Tracking</h2>
          <p className="text-gray-600">Monitor and manage all deliveries</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{activeDeliveries.length}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{completedDeliveries.length}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Deliveries</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeDeliveries.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active deliveries</h3>
                <p className="text-gray-500">All deliveries are completed or none have been assigned yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeDeliveries.map((delivery) => (
                <Card key={delivery.id} className="animate-fade-in-up">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{delivery.order.product.name}</CardTitle>
                          <CardDescription>
                            Order #{delivery.order_id.slice(-8)} • {formatPrice(delivery.order.total_amount)}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(delivery.status)}>{delivery.status.replace("_", " ")}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Delivery Progress</span>
                        <span>{getStatusProgress(delivery.status)}%</span>
                      </div>
                      <Progress value={getStatusProgress(delivery.status)} className="h-2" />
                    </div>

                    {/* Driver Info */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{delivery.driver_name}</p>
                          <p className="text-sm text-gray-500">
                            {delivery.vehicle_info.type} • {delivery.vehicle_info.plate_number}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>

                    {/* Route Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm font-medium text-gray-700">
                          <MapPin className="h-4 w-4 mr-2 text-green-600" />
                          Pickup Location
                        </div>
                        <p className="text-sm text-gray-600 pl-6">
                          {delivery.pickup_location.address}, {delivery.pickup_location.city}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 pl-6">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(delivery.pickup_time)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm font-medium text-gray-700">
                          <MapPin className="h-4 w-4 mr-2 text-red-600" />
                          Delivery Location
                        </div>
                        <p className="text-sm text-gray-600 pl-6">
                          {delivery.delivery_location.address}, {delivery.delivery_location.city}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 pl-6">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(delivery.delivery_time)}
                        </div>
                      </div>
                    </div>

                    {/* Route Stats */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Route className="h-4 w-4 mr-1" />
                          {delivery.estimated_distance} km
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {delivery.estimated_duration} mins
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Navigation className="h-4 w-4 mr-2" />
                        Track Live
                      </Button>
                    </div>

                    {/* Customer Info */}
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-500">Customer: </span>
                        <span className="font-medium">{delivery.order.buyer.full_name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">From: </span>
                        <span className="font-medium">{delivery.order.product.farmer.full_name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedDeliveries.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No completed deliveries</h3>
                <p className="text-gray-500">Completed deliveries will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {completedDeliveries.map((delivery) => (
                <Card key={delivery.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{delivery.order.product.name}</p>
                          <p className="text-sm text-gray-500">
                            Delivered by {delivery.driver_name} • {formatTime(delivery.delivery_time)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                    <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
                  </div>
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {deliveries.length > 0 ? Math.round((completedDeliveries.length / deliveries.length) * 100) : 0}%
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Distance</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {deliveries.length > 0
                        ? Math.round(deliveries.reduce((sum, d) => sum + d.estimated_distance, 0) / deliveries.length)
                        : 0}{" "}
                      km
                    </p>
                  </div>
                  <Route className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {deliveries.length > 0
                        ? Math.round(deliveries.reduce((sum, d) => sum + d.estimated_duration, 0) / deliveries.length)
                        : 0}{" "}
                      min
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
