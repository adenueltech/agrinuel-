"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Star, ShoppingCart, MessageCircle, Leaf, Package } from "lucide-react"

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

interface ProductDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  onOrder: () => void
  onChat: () => void
}

export function ProductDetailsModal({ isOpen, onClose, product, onOrder, onChat }: ProductDetailsModalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Images */}
          <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="bg-green-200 p-6 rounded-full w-fit mx-auto mb-4">
                    <Leaf className="h-12 w-12 text-green-600" />
                  </div>
                  <p className="text-lg text-green-600 font-medium">{product.category?.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            {product.organic && (
              <Badge className="bg-green-600 text-white">
                <Leaf className="h-3 w-3 mr-1" />
                Organic
              </Badge>
            )}
            {product.quality_grade && <Badge variant="secondary">Grade {product.quality_grade}</Badge>}
            <Badge variant="outline">{product.category?.name}</Badge>
          </div>

          {/* Price and Availability */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-2xl font-bold text-green-600">{formatPrice(product.price_per_unit)}</p>
              <p className="text-sm text-green-600">per {product.unit}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {product.quantity_available} {product.unit}
              </p>
              <p className="text-sm text-gray-600">available</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Product Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Package className="h-4 w-4 mr-3" />
                  <span>Category: {product.category?.name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-3" />
                  <span>Harvested: {formatDate(product.harvest_date)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-3" />
                  <span>Location: {product.location?.city || "Not specified"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Farmer Information</h3>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.farmer.full_name}</p>
                  <p className="text-sm text-gray-600">Verified Farmer</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={onOrder} className="flex-1 bg-green-600 hover:bg-green-700">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Place Order
            </Button>
            <Button variant="outline" onClick={onChat} className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Farmer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}