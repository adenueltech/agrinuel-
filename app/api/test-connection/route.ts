import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase.from("users").select("count(*)").limit(1)

    if (error) {
      console.log("[v0] Supabase connection error:", error.message)
      return NextResponse.json({
        success: false,
        error: error.message,
        message: "Database connection failed. Make sure to run the SQL scripts first.",
      })
    }

    console.log("[v0] Supabase connection successful")
    return NextResponse.json({
      success: true,
      message: "Supabase connection successful!",
      data: data,
    })
  } catch (error) {
    console.log("[v0] Connection test failed:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to connect to Supabase",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
