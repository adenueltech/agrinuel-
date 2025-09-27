"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"

export default function VerifyPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleVerification = async () => {
      try {
        // Check if we have verification tokens in URL
        const token = searchParams.get("token")
        const type = searchParams.get("type")

        if (token && type === "signup") {
          // Handle email confirmation
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email",
          })

          if (error) {
            setStatus("error")
            setMessage("Verification failed. The link may be expired or invalid.")
          } else {
            setStatus("success")
            setMessage("Your email has been successfully verified!")
          }
        } else {
          // Check current session
          const { data: { session } } = await supabase.auth.getSession()

          if (session?.user.email_confirmed_at) {
            setStatus("success")
            setMessage("Your email has been successfully verified!")
          } else {
            setStatus("error")
            setMessage("Verification failed. Please try again or request a new confirmation email.")
          }
        }
      } catch (error) {
        setStatus("error")
        setMessage("An error occurred during verification.")
      }
    }

    handleVerification()
  }, [searchParams, supabase])

  const handleContinue = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-agriculture flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />}
            {status === "success" && <CheckCircle className="h-12 w-12 text-green-500" />}
            {status === "error" && <CheckCircle className="h-12 w-12 text-red-500" />}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verifying..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === "success" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You can now sign in to your AgriNuel account.
              </p>
              <Button onClick={handleContinue} className="w-full">
                Go to Sign In
              </Button>
            </div>
          )}
          {status === "error" && (
            <div className="space-y-4">
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                Back to Home
              </Button>
              <Button onClick={() => router.push("/login")} className="w-full">
                Try Signing In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}