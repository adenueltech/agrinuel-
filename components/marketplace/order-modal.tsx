"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Loader2, MapPin, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price_per_unit: number
  unit: string
  quantity_available: number
  farmer: {
    full_name: string
  }
  location?: {
    city: string
  }
}

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

export function OrderModal({ isOpen, onClose, product }: OrderModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const totalAmount = quantity * product.price_per_unit

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price)
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Get farmer ID from product
      const { data: productData } = await supabase.from("products").select("farmer_id").eq("id", product.id).single()

      if (!productData) throw new Error("Product not found")

      const orderData = {
        buyer_id: user.id,
        farmer_id: productData.farmer_id,
        product_id: product.id,
        quantity: quantity,
        unit_price: product.price_per_unit,
        total_amount: totalAmount,
        delivery_address: {
          address: formData.get("address") as string,
          city: formData.get("city") as string,
          state: formData.get("state") as string,
          phone: formData.get("phone") as string,
        },
        delivery_date: formData.get("delivery_date") as string,
      }

      const { data: newOrder, error } = await supabase.from("orders").insert(orderData).select().single()

      if (error) throw error

      // Update product quantity
      const newQuantity = product.quantity_available - quantity
      await supabase.from("products").update({ quantity_available: newQuantity }).eq("id", product.id)

      const deliveryData = {
        order_id: newOrder.id,
        driver_name: "Auto-assigned Driver",
        driver_phone: "+234 800 000 0000",
        vehicle_info: {
          type: "Truck",
          plate_number: "AUTO-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
          capacity: "2 tons",
        },
        pickup_location: {
          address: "Farm Location",
          city: product.location?.city || "Unknown",
          coordinates: { lat: 6.5244, lng: 3.3792 },
        },
        delivery_location: {
          address: formData.get("address") as string,
          city: formData.get("city") as string,
          coordinates: { lat: 6.5244, lng: 3.3792 },
        },
        estimated_distance: Math.round(Math.random() * 50 + 10), // 10-60 km
        estimated_duration: Math.round(Math.random() * 60 + 30), // 30-90 minutes
        status: "assigned",
      }

      await supabase.from("deliveries").insert(deliveryData)

      onClose()
      // TODO: Show success message and redirect to orders page
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Place Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Details */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-green-200 rounded-lg flex items-center justify-center">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-green-800 text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-green-700 mb-2">{product.description}</p>
                <div className="flex items-center text-sm text-green-600 mb-2">
                  <span>From {product.farmer.full_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600">Price per {product.unit}:</span>
                  <span className="font-semibold text-green-800 text-lg">{formatPrice(product.price_per_unit)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-green-600">Available:</span>
                  <span className="text-sm text-green-800">{product.quantity_available} {product.unit}</span>
                </div>
              </div>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-4">
            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity ({product.unit})</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={product.quantity_available}
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                required
              />
              <p className="text-xs text-gray-500">
                Available: {product.quantity_available} {product.unit}
              </p>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Delivery Information
              </h4>
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea id="address" name="address" placeholder="Enter your full delivery address" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" placeholder="e.g., Lagos" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" placeholder="e.g., Lagos State" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+234 800 000 0000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_date">Preferred Delivery Date</Label>
                  <Input id="delivery_date" name="delivery_date" type="date" required />
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>
                  {quantity} {product.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Unit Price:</span>
                <span>{formatPrice(product.price_per_unit)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-green-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
            )}

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
