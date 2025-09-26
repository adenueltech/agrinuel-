"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2, Sprout } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredUserType?: "farmer" | "buyer"
}

export function AuthGuard({ children, requiredUserType }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
          return
        }

        // Get user profile data
        const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (requiredUserType && profile?.user_type !== requiredUserType) {
          router.push("/dashboard")
          return
        }

        setUser({ ...user, profile })
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [router, requiredUserType, supabase])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-agriculture flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce-gentle mb-4">
            <Sprout className="h-12 w-12 text-white mx-auto" />
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading AgriNuel...</span>
          </div>
        </div>
      </div>
    )
  }

  return user ? <>{children}</> : null
}
