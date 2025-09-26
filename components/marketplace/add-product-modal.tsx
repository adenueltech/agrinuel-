"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Upload } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onProductAdded: () => void
}

export function AddProductModal({ isOpen, onClose, categories, onProductAdded }: AddProductModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const productData = {
        farmer_id: user.id,
        category_id: formData.get("category_id") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price_per_unit: Number.parseFloat(formData.get("price_per_unit") as string),
        unit: formData.get("unit") as string,
        quantity_available: Number.parseInt(formData.get("quantity_available") as string),
        harvest_date: formData.get("harvest_date") as string,
        quality_grade: formData.get("quality_grade") as string,
        organic: formData.get("organic") === "on",
        location: {
          city: formData.get("city") as string,
          state: formData.get("state") as string,
        },
        images: [], // TODO: Implement image upload
      }

      const { error } = await supabase.from("products").insert(productData)

      if (error) throw error

      onProductAdded()
      onClose()
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
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" placeholder="e.g., Fresh Tomatoes" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select name="category_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe your product..." rows={3} required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_per_unit">Price per Unit (₦)</Label>
              <Input id="price_per_unit" name="price_per_unit" type="number" step="0.01" placeholder="0.00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select name="unit" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="ton">Ton</SelectItem>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="crate">Crate</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity_available">Quantity Available</Label>
              <Input id="quantity_available" name="quantity_available" type="number" placeholder="0" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harvest_date">Harvest Date</Label>
              <Input id="harvest_date" name="harvest_date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality_grade">Quality Grade</Label>
              <Select name="quality_grade">
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Grade A (Premium)</SelectItem>
                  <SelectItem value="B">Grade B (Standard)</SelectItem>
                  <SelectItem value="C">Grade C (Basic)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="e.g., Lagos" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" placeholder="e.g., Lagos State" required />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="organic" name="organic" />
            <Label htmlFor="organic">Organic Product</Label>
          </div>

          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Image upload coming soon</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
