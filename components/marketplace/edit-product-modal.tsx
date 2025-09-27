"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Upload, X } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  description: string
  price_per_unit: number
  unit: string
  quantity_available: number
  harvest_date: string
  quality_grade: string
  organic: boolean
  location: {
    city: string
    state: string
  }
  category_id: string
  images: string[]
}

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  categories: Category[]
  onProductUpdated: () => void
}

export function EditProductModal({ isOpen, onClose, product, categories, onProductUpdated }: EditProductModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(product.images || [])
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price_per_unit: product.price_per_unit.toString(),
    unit: product.unit,
    quantity_available: product.quantity_available.toString(),
    harvest_date: product.harvest_date,
    quality_grade: product.quality_grade,
    organic: product.organic,
    city: product.location?.city || "",
    state: product.location?.state || "",
    category_id: product.category_id,
  })
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: product.name,
        description: product.description,
        price_per_unit: product.price_per_unit.toString(),
        unit: product.unit,
        quantity_available: product.quantity_available.toString(),
        harvest_date: product.harvest_date,
        quality_grade: product.quality_grade,
        organic: product.organic,
        city: product.location?.city || "",
        state: product.location?.state || "",
        category_id: product.category_id,
      })
      setExistingImages(product.images || [])
      setSelectedImages([])
    }
  }, [isOpen, product])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length + selectedImages.length + existingImages.length > 5) {
      setError("Maximum 5 images allowed")
      return
    }
    setSelectedImages(prev => [...prev, ...files])
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [...existingImages]

    for (const file of selectedImages) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      uploadedUrls.push(publicUrl)
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Upload new images
      const allImageUrls = await uploadImages()

      const updateData = {
        name: formData.name,
        description: formData.description,
        price_per_unit: Number.parseFloat(formData.price_per_unit),
        unit: formData.unit,
        quantity_available: Number.parseInt(formData.quantity_available),
        harvest_date: formData.harvest_date,
        quality_grade: formData.quality_grade,
        organic: formData.organic,
        location: {
          city: formData.city,
          state: formData.state,
        },
        category_id: formData.category_id,
        images: allImageUrls,
      }

      const { error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", product.id)

      if (error) throw error

      onProductUpdated()
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
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Fresh Tomatoes"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
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
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your product..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_per_unit">Price per Unit (₦)</Label>
              <Input
                id="price_per_unit"
                type="number"
                step="0.01"
                value={formData.price_per_unit}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_unit: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
              >
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
              <Input
                id="quantity_available"
                type="number"
                value={formData.quantity_available}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity_available: e.target.value }))}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harvest_date">Harvest Date</Label>
              <Input
                id="harvest_date"
                type="date"
                value={formData.harvest_date}
                onChange={(e) => setFormData(prev => ({ ...prev, harvest_date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality_grade">Quality Grade</Label>
              <Select
                value={formData.quality_grade}
                onValueChange={(value) => setFormData(prev => ({ ...prev, quality_grade: value }))}
              >
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
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g., Lagos"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="e.g., Lagos State"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="organic"
              checked={formData.organic}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, organic: checked }))}
            />
            <Label htmlFor="organic">Organic Product</Label>
          </div>

          <div className="space-y-2">
            <Label>Product Images (Max 5)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="text-center py-4">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to add more images</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
                </div>
              </label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {existingImages.map((url, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img
                        src={url}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New Images */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {selectedImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                  Updating Product...
                </>
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}