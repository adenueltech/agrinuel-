"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, MapPin, Calendar, RefreshCw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Button } from "@/components/ui/button"

interface MarketPrice {
  id: string
  category_id: string
  location: string
  price_per_unit: number
  unit: string
  market_name: string
  updated_at: string
  category: {
    name: string
  }
}

interface PriceHistory {
  id: string
  product_id: string
  price: number
  recorded_at: string
  product: {
    name: string
    category: {
      name: string
    }
  }
}

interface PriceTrend {
  date: string
  price: number
  location: string
}

export function PriceTracker() {
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([])
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const supabase = createClient()

  const fetchPriceData = async () => {
    try {
      setIsLoading(true)

      // Fetch current market prices
      const { data: marketData } = await supabase
        .from("market_prices")
        .select(
          `
          *,
          category:categories(name)
        `,
        )
        .order("updated_at", { ascending: false })

      setMarketPrices(marketData || [])

      // Fetch price history for trending
      const { data: historyData } = await supabase
        .from("price_history")
        .select(
          `
          *,
          product:products(
            name,
            category:categories(name)
          )
        `,
        )
        .order("recorded_at", { ascending: false })
        .limit(100)

      setPriceHistory(historyData || [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching price data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPriceData()

    // Set up real-time subscription for price updates
    const subscription = supabase
      .channel("price_updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "market_prices" }, () => {
        fetchPriceData()
      })
      .subscribe()

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchPriceData, 5 * 60 * 1000)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
    }
  }, [supabase])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Filter prices based on selected category and location
  const filteredPrices = marketPrices.filter((price) => {
    const matchesCategory = selectedCategory === "all" || price.category?.name === selectedCategory
    const matchesLocation = selectedLocation === "all" || price.location === selectedLocation
    return matchesCategory && matchesLocation
  })

  // Get unique categories and locations for filters
  const categories = Array.from(new Set(marketPrices.map((p) => p.category?.name).filter(Boolean)))
  const locations = Array.from(new Set(marketPrices.map((p) => p.location)))

  // Generate trend data for charts
  const generateTrendData = (categoryName: string) => {
    const categoryPrices = marketPrices.filter((p) => p.category?.name === categoryName)
    const locationGroups = categoryPrices.reduce(
      (acc, price) => {
        if (!acc[price.location]) acc[price.location] = []
        acc[price.location].push(price)
        return acc
      },
      {} as Record<string, MarketPrice[]>,
    )

    return Object.entries(locationGroups).map(([location, prices]) => ({
      location,
      price: prices[0]?.price_per_unit || 0,
      change: Math.random() > 0.5 ? Math.random() * 50 : -Math.random() * 30, // Mock price change
    }))
  }

  // Calculate average prices by category
  const categoryAverages = categories.map((category) => {
    const categoryPrices = marketPrices.filter((p) => p.category?.name === category)
    const avgPrice = categoryPrices.reduce((sum, p) => sum + p.price_per_unit, 0) / categoryPrices.length
    const change = Math.random() > 0.5 ? Math.random() * 15 : -Math.random() * 10 // Mock change percentage

    return {
      category,
      avgPrice,
      change,
      count: categoryPrices.length,
    }
  })

  return (
    <div className="space-y-6">
      {/* Header with filters and refresh */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Market Prices</h2>
          <p className="text-gray-600 flex items-center mt-1">
            <Activity className="h-4 w-4 mr-1" />
            Last updated: {formatTime(lastUpdated.toISOString())}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={fetchPriceData} variant="outline" size="icon" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Price Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryAverages.slice(0, 4).map((item) => (
          <Card key={item.category} className="animate-fade-in-up">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.category}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(item.avgPrice)}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={item.change >= 0 ? "default" : "destructive"}
                    className={item.change >= 0 ? "bg-green-100 text-green-800" : ""}
                  >
                    {item.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(item.change).toFixed(1)}%
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{item.count} markets</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Price Comparison Chart */}
      <Card className="animate-slide-in-right">
        <CardHeader>
          <CardTitle>Price Comparison by Location</CardTitle>
          <CardDescription>Compare prices across different markets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={generateTrendData(selectedCategory === "all" ? categories[0] : selectedCategory)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis tickFormatter={(value) => `₦${value}`} />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), "Price"]}
                  labelStyle={{ color: "#374151" }}
                />
                <Bar dataKey="price" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Current Market Prices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Market Prices</CardTitle>
          <CardDescription>Real-time prices from various markets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPrices.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No price data available for selected filters</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPrices.map((price) => (
                  <div
                    key={price.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Activity className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{price.category?.name}</h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>
                              {price.market_name}, {price.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{formatPrice(price.price_per_unit)}</p>
                      <p className="text-xs text-gray-500">per {price.unit}</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatTime(price.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Price History Trend */}
      {priceHistory.length > 0 && (
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Price Trends</CardTitle>
            <CardDescription>Historical price movements over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={priceHistory.slice(0, 20).map((item, index) => ({
                    time: formatTime(item.recorded_at),
                    price: item.price,
                    name: item.product?.name,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis tickFormatter={(value) => `₦${value}`} />
                  <Tooltip
                    formatter={(value: number) => [formatPrice(value), "Price"]}
                    labelStyle={{ color: "#374151" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#16a34a", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
