"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Star, ShoppingCart, MessageCircle, Leaf } from "lucide-react"
import { OrderModal } from "./order-modal"
import { ChatModal } from "./chat-modal"
import { ProductDetailsModal } from "./product-details-modal"
import { EditProductModal } from "./edit-product-modal"

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
  category_id: string
  farmer: {
    full_name: string
    profile_image_url?: string
  }
  category: {
    name: string
  }
}

interface User {
  id: string
  user_type: "farmer" | "buyer"
}

interface ProductCardProps {
  product: Product
  currentUser: User | null
  categories?: Category[]
  onProductUpdated?: () => void
}

interface Category {
  id: string
  name: string
}

export function ProductCard({ product, currentUser, categories = [], onProductUpdated }: ProductCardProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in-up">
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="bg-green-200 p-4 rounded-full w-fit mx-auto mb-2">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-sm text-green-600 font-medium">{product.category?.name}</p>
              </div>
            )}
          </div>
          <div className="absolute top-2 left-2 flex gap-2">
            {product.organic && (
              <Badge className="bg-green-600 text-white">
                <Leaf className="h-3 w-3 mr-1" />
                Organic
              </Badge>
            )}
            {product.quality_grade && <Badge variant="secondary">Grade {product.quality_grade}</Badge>}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 text-balance">{product.name}</h3>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">{formatPrice(product.price_per_unit)}</p>
              <p className="text-xs text-gray-500">per {product.unit}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2 text-pretty">{product.description}</p>

          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{product.location?.city || "Location not specified"}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Harvested: {formatDate(product.harvest_date)}</span>
            </div>
            <div className="flex items-center">
              <ShoppingCart className="h-3 w-3 mr-1" />
              <span>
                {product.quantity_available} {product.unit} available
              </span>
            </div>
          </div>

          <div className="flex items-center mt-3 pt-3 border-t">
            <div className="bg-green-100 p-1 rounded-full mr-2">
              <Star className="h-3 w-3 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">{product.farmer.full_name}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            {currentUser?.user_type === "buyer" && (
              <>
                <Button onClick={() => setIsDetailsModalOpen(true)} className="flex-1 bg-green-600 hover:bg-green-700">
                  View Details
                </Button>
                <Button variant="outline" size="icon" onClick={() => setIsChatModalOpen(true)}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </>
            )}
            {currentUser?.user_type === "farmer" && product.farmer_id === currentUser.id && (
              <Button
                onClick={() => setIsEditModalOpen(true)}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Edit Details
              </Button>
            )}
            {currentUser?.user_type === "farmer" && product.farmer_id !== currentUser.id && (
              <>
                <Button onClick={() => setIsDetailsModalOpen(true)} className="flex-1 bg-green-600 hover:bg-green-700">
                  View Details
                </Button>
                <Button variant="outline" size="icon" onClick={() => setIsChatModalOpen(true)}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      <ProductDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        product={product}
        currentUser={currentUser}
        onOrder={() => {
          setIsDetailsModalOpen(false)
          setIsOrderModalOpen(true)
        }}
        onChat={() => {
          setIsDetailsModalOpen(false)
          setIsChatModalOpen(true)
        }}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
        categories={categories}
        onProductUpdated={onProductUpdated || (() => {})}
      />
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} product={product} />
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        farmerId={product.farmer_id}
        farmerName={product.farmer.full_name}
        productName={product.name}
      />
    </>
  )
}
