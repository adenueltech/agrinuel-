import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createAdminClient()

    // Example admin operation - seeding initial data
    const { data, error } = await supabase.from("market_prices").upsert([
      {
        product_name: "Rice",
        category: "Grains",
        current_price: 450.0,
        location: "Lagos",
        unit: "kg",
        last_updated: new Date().toISOString(),
      },
      {
        product_name: "Tomatoes",
        category: "Vegetables",
        current_price: 200.0,
        location: "Kano",
        unit: "kg",
        last_updated: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Admin operation error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Admin operation completed successfully",
      data,
    })
  } catch (error) {
    console.error("Admin API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
