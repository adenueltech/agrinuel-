"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Plus,
  Sprout,
  ShoppingCart,
  User,
  LogOut,
  Package,
  TrendingUp,
  Truck,
  MessageCircle,
} from "lucide-react"
import { ProductCard } from "@/components/marketplace/product-card"
import { AddProductModal } from "@/components/marketplace/add-product-modal"
import { PriceTracker } from "@/components/price-tracking/price-tracker"
import { DeliveryTracker } from "@/components/logistics/delivery-tracker"
import { RouteOptimizer } from "@/components/logistics/route-optimizer"
import { ChatInterface } from "@/components/chat/chat-interface"
import { useRouter } from "next/navigation"

// interface User {
//   id: string
//   email: string
//   full_name: string
//   user_type: "farmer" | "buyer"
//   profile_image_url?: string
// }

interface Product {
  id: string
  name: string
  description: string
  price_per_unit: number
  unit: string
  quantity_available: number
  images: string[]
  location: any
  quality_grade: string
  organic: boolean
  harvest_date: string
  farmer_id: string
  farmer: {
    full_name: string
    profile_image_url?: string
  }
  category: {
    name: string
  }
}

interface Category {
  id: string
  name: string
  description: string
  image_url: string
}

export function DashboardContent() {
  const [user, setUser] = useState<any | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const fetchData = async () => {
    try {
      // Get current user
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) return

      const { data: userProfile } = await supabase.from("users").select("*").eq("id", authUser.id).single()
      setUser(userProfile)

      // Fetch categories
      const { data: categoriesData } = await supabase.from("categories").select("*").order("name")
      setCategories(categoriesData || [])

      // Fetch products with farmer and category info
      const { data: productsData } = await supabase
        .from("products")
        .select(
          `
          *,
          farmer:users!products_farmer_id_fkey(full_name, profile_image_url),
          category:categories(name)
        `,
        )
        .eq("status", "available")
        .order("created_at", { ascending: false })

      setProducts(productsData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category?.name === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-agriculture flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce-gentle mb-4">
            <Sprout className="h-12 w-12 text-white mx-auto" />
          </div>
          <div className="text-white">Loading marketplace...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-green-800">AgriNuel</h1>
                <p className="text-xs md:text-sm text-green-600">Agricultural Marketplace</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.user_type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/profile")}
                  className="text-xs md:text-sm"
                >
                  Profile
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs md:text-sm">
                  <LogOut className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="marketplace" className="w-full">
          <div className="mb-8 overflow-x-auto">
            <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground min-w-full md:min-w-0">
              <TabsTrigger value="marketplace" className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Marketplace</span>
                <span className="sm:hidden">Shop</span>
              </TabsTrigger>
              <TabsTrigger value="my-products" className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4">
                {user?.user_type === "farmer" ? (
                  <>
                    <Package className="h-4 w-4" />
                    <span className="hidden sm:inline">My Products</span>
                    <span className="sm:hidden">Products</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">My Orders</span>
                    <span className="sm:hidden">Orders</span>
                  </>
                )}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="logistics" className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4">
                <Truck className="h-4 w-4" />
                <span className="hidden sm:inline">Logistics</span>
                <span className="sm:hidden">Delivery</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
                <span className="sm:hidden">Chat</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="marketplace" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {user?.user_type === "farmer" && (
                    <div className="flex justify-center sm:justify-start">
                      <Button onClick={() => setIsAddProductOpen(true)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedCategory === category.name ? "ring-2 ring-green-500 bg-green-50" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-2">
                      <Sprout className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-900 text-balance">{category.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} currentUser={user} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Sprout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="my-products" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl md:text-2xl font-bold">My Products</h2>
              {user?.user_type === "farmer" && (
                <Button onClick={() => setIsAddProductOpen(true)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add New Product</span>
                  <span className="sm:hidden">Add Product</span>
                </Button>
              )}
            </div>

            {user?.user_type === "farmer" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products
                  .filter((product) => product.farmer_id === user.id)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currentUser={user}
                      categories={categories}
                      onProductUpdated={fetchData}
                    />
                  ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Order Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-2">
                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">12</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-2">
                        <Package className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">8</p>
                      <p className="text-sm text-gray-600">Delivered</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="bg-yellow-100 p-3 rounded-full w-fit mx-auto mb-2">
                        <Truck className="h-6 w-6 text-yellow-600" />
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">3</p>
                      <p className="text-sm text-gray-600">In Transit</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-2">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-purple-600">₦125,000</p>
                      <p className="text-sm text-gray-600">Total Spent</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mock order data */}
                      {[
                        { id: "ORD-001", product: "Fresh Tomatoes", farmer: "Adebayo Farms", status: "Delivered", amount: "₦15,000", date: "2024-01-15" },
                        { id: "ORD-002", product: "Cassava Tubers", farmer: "Green Valley", status: "In Transit", amount: "₦22,000", date: "2024-01-14" },
                        { id: "ORD-003", product: "Yam Tubers", farmer: "AgroPlus", status: "Processing", amount: "₦18,000", date: "2024-01-13" },
                      ].map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Package className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{order.product}</p>
                              <p className="text-sm text-gray-600">from {order.farmer}</p>
                              <p className="text-xs text-gray-500">{order.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{order.amount}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Button variant="outline">
                        View All Orders
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Favorite Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.slice(0, 3).map((product) => (
                        <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Sprout className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-600">{product.farmer.full_name}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {user?.user_type === "farmer" && products.filter((product) => product.farmer_id === user.id).length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-500 mb-4">Start selling by adding your first product</p>
                  <Button onClick={() => setIsAddProductOpen(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <PriceTracker />
          </TabsContent>

          <TabsContent value="logistics">
            <Tabs defaultValue="deliveries" className="w-full">
              <div className="mb-6 overflow-x-auto">
                <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground min-w-full sm:min-w-0">
                  <TabsTrigger value="deliveries" className="px-3 md:px-4">
                    <span className="hidden sm:inline">Delivery Tracking</span>
                    <span className="sm:hidden">Tracking</span>
                  </TabsTrigger>
                  <TabsTrigger value="routes" className="px-3 md:px-4">
                    <span className="hidden sm:inline">Route Optimizer</span>
                    <span className="sm:hidden">Routes</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="deliveries">
                <DeliveryTracker />
              </TabsContent>
              <TabsContent value="routes">
                <RouteOptimizer />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="messages">
            <ChatInterface />
          </TabsContent>
        </Tabs>
      </div>

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        categories={categories}
        onProductAdded={() => {
          // Refresh products
          window.location.reload()
        }}
      />
    </div>
  )
}
