"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"
import {
  User,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Image as ImageIcon,
  Sprout,
  ShoppingCart
} from "lucide-react"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone: string
  user_type: "farmer" | "buyer"
  profile_image_url?: string
  bio?: string
  location?: string
  farm_size?: string
  experience_years?: number
  specializations?: string[]
  created_at: string
}

interface ProductPost {
  id: string
  name: string
  description: string
  images: string[]
  price_per_unit: number
  unit: string
  created_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [products, setProducts] = useState<ProductPost[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) return

        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single()

        if (profile) {
          setUser(profile)
          setEditForm(profile)

          // Fetch user's products if they're a farmer
          if (profile.user_type === "farmer") {
            const { data: productsData } = await supabase
              .from("products")
              .select("*")
              .eq("farmer_id", authUser.id)
              .order("created_at", { ascending: false })
              .limit(6)

            setProducts(productsData || [])
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [supabase])

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("users")
        .update(editForm)
        .eq("id", user.id)

      if (error) throw error

      setUser({ ...user, ...editForm })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `profile-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_image_url: publicUrl })
        .eq("id", user.id)

      if (updateError) throw updateError

      setUser({ ...user, profile_image_url: publicUrl })
      setEditForm({ ...editForm, profile_image_url: publicUrl })
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-bounce-gentle mb-4">
              <Sprout className="h-12 w-12 text-green-600 mx-auto" />
            </div>
            <div className="text-gray-600">Loading profile...</div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!user) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-600">Profile not found</div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.profile_image_url || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">
                        {user.full_name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700">
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
                      <Badge variant={user.user_type === "farmer" ? "default" : "secondary"}>
                        {user.user_type === "farmer" ? <Sprout className="h-3 w-3 mr-1" /> : <ShoppingCart className="h-3 w-3 mr-1" />}
                        {user.user_type}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Member since {new Date(user.created_at).toLocaleDateString("en-NG", {
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleSaveProfile} disabled={isSaving}>
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? "Saving..." : "Save"}
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Account Type</span>
                        <Badge variant={user.user_type === "farmer" ? "default" : "secondary"}>
                          {user.user_type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Member Since</span>
                        <span className="text-sm">
                          {new Date(user.created_at).toLocaleDateString("en-NG", {
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      {user.user_type === "farmer" && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Products Listed</span>
                          <span className="font-medium">{products.length}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Profile updated</p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                          </div>
                        </div>
                        {user.user_type === "farmer" && products.length > 0 && (
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Sprout className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">New product listed</p>
                              <p className="text-xs text-gray-500">1 week ago</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="full_name"
                            value={editForm.full_name || ""}
                            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                          />
                        ) : (
                          <p className="text-sm text-gray-900 py-2">{user.full_name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <p className="text-sm text-gray-900 py-2">{user.email}</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={editForm.phone || ""}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          />
                        ) : (
                          <p className="text-sm text-gray-900 py-2">{user.phone || "Not provided"}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={editForm.location || ""}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          />
                        ) : (
                          <p className="text-sm text-gray-900 py-2">{user.location || "Not provided"}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={editForm.bio || ""}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          placeholder="Tell us about yourself..."
                          rows={4}
                        />
                      ) : (
                        <p className="text-sm text-gray-900 py-2">{user.bio || "No bio added yet"}</p>
                      )}
                    </div>

                    {user.user_type === "farmer" && (
                      <>
                        <Separator />
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="farm_size">Farm Size</Label>
                            {isEditing ? (
                              <Input
                                id="farm_size"
                                value={editForm.farm_size || ""}
                                onChange={(e) => setEditForm({ ...editForm, farm_size: e.target.value })}
                                placeholder="e.g., 5 hectares"
                              />
                            ) : (
                              <p className="text-sm text-gray-900 py-2">{user.farm_size || "Not specified"}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="experience_years">Years of Experience</Label>
                            {isEditing ? (
                              <Input
                                id="experience_years"
                                type="number"
                                value={editForm.experience_years || ""}
                                onChange={(e) => setEditForm({ ...editForm, experience_years: parseInt(e.target.value) })}
                              />
                            ) : (
                              <p className="text-sm text-gray-900 py-2">{user.experience_years ? `${user.experience_years} years` : "Not specified"}</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="posts" className="space-y-6">
                {user.user_type === "farmer" ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">My Products</h2>
                      <Button onClick={() => router.push("/dashboard")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Product
                      </Button>
                    </div>

                    {products.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                          <Card key={product.id} className="overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Sprout className="h-8 w-8 text-green-600" />
                              )}
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-green-600">
                                  ₦{product.price_per_unit}/{product.unit}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(product.created_at).toLocaleDateString("en-NG", {
                                    month: "short",
                                    day: "numeric"
                                  })}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <Sprout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                          <p className="text-gray-500 mb-4">Start showcasing your products</p>
                          <Button onClick={() => router.push("/dashboard")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Product
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Buyer Profile</h3>
                      <p className="text-gray-500 mb-4">Manage your preferences and shopping history</p>
                      <Button onClick={() => router.push("/dashboard")}>
                        View Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  )
}