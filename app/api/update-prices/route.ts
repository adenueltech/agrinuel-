import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()

    // Simulate price updates with realistic fluctuations
    const priceUpdates = [
      { category: "Grains & Cereals", locations: ["Lagos", "Abuja", "Kano", "Port Harcourt", "Ibadan"] },
      { category: "Vegetables", locations: ["Lagos", "Abuja", "Kano", "Port Harcourt", "Ibadan"] },
      { category: "Fruits", locations: ["Lagos", "Abuja", "Kano", "Port Harcourt", "Ibadan"] },
    ]

    for (const category of priceUpdates) {
      // Get category ID
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", category.category)
        .single()

      if (!categoryData) continue

      for (const location of category.locations) {
        // Get current price
        const { data: currentPrice } = await supabase
          .from("market_prices")
          .select("price_per_unit")
          .eq("category_id", categoryData.id)
          .eq("location", location)
          .single()

        if (currentPrice) {
          // Generate realistic price fluctuation (-5% to +5%)
          const fluctuation = (Math.random() - 0.5) * 0.1 // -5% to +5%
          const newPrice = currentPrice.price_per_unit * (1 + fluctuation)

          // Update price
          await supabase
            .from("market_prices")
            .update({
              price_per_unit: Math.round(newPrice * 100) / 100,
              updated_at: new Date().toISOString(),
            })
            .eq("category_id", categoryData.id)
            .eq("location", location)
        }
      }
    }

    return NextResponse.json({ success: true, message: "Prices updated successfully" })
  } catch (error) {
    console.error("Error updating prices:", error)
    return NextResponse.json({ error: "Failed to update prices" }, { status: 500 })
  }
}
