"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface RouteStop {
  id: string
  address: string
  city: string
  type: "pickup" | "delivery"
  priority: "high" | "medium" | "low"
}

interface RouteMapProps {
  stops: RouteStop[]
  center?: [number, number]
  zoom?: number
}

export function RouteMap({ stops, center = [6.5244, 3.3792], zoom = 10 }: RouteMapProps) {
  // Filter out stops without coordinates (for demo, we'll use mock coordinates)
  const validStops = stops.filter(stop => stop.address && stop.city)

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validStops.map((stop, index) => {
          // Mock coordinates for Lagos area (in real app, use geocoding API)
          const mockLat = 6.5244 + (Math.random() - 0.5) * 0.1
          const mockLng = 3.3792 + (Math.random() - 0.5) * 0.1

          return (
            <Marker key={stop.id} position={[mockLat, mockLng]}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">Stop {index + 1}</div>
                  <div className="capitalize">{stop.type}</div>
                  <div>{stop.address}</div>
                  <div>{stop.city}</div>
                  <div className={`text-xs mt-1 px-2 py-1 rounded ${
                    stop.priority === 'high' ? 'bg-red-100 text-red-800' :
                    stop.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {stop.priority} priority
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}