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

  useEffect(() => {
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
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">AgriNuel</h1>
                <p className="text-sm text-green-600">Agricultural Marketplace</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.user_type}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="marketplace" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Marketplace</span>
            </TabsTrigger>
            <TabsTrigger value="my-products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>My Products</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex items-center space-x-2">
              <Truck className="h-4 w-4" />
              <span>Logistics</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Messages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
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
                    <SelectTrigger className="w-full md:w-48">
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
                  {user?.user_type === "farmer" && (
                    <Button onClick={() => setIsAddProductOpen(true)} className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
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

          <TabsContent value="my-products">
            <Card>
              <CardHeader>
                <CardTitle>My Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Your product management interface will be here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <PriceTracker />
          </TabsContent>

          <TabsContent value="logistics">
            <Tabs defaultValue="deliveries" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="deliveries">Delivery Tracking</TabsTrigger>
                <TabsTrigger value="routes">Route Optimizer</TabsTrigger>
              </TabsList>
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
