import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { type FoodListing } from "@shared/schema";

// Leaflet default icon fix for bundlers
// @ts-ignore - images provided by leaflet package
delete (L.Icon.Default as any).prototype._getIconUrl;
(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
});

function pseudoRandomCoords(seed: string): [number, number] {
  // Deterministic pseudo-random coordinates around India's centroid
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const baseLat = 22.9734; // India approx centroid
  const baseLng = 78.6569;
  const lat = baseLat + (((h & 0xff) - 128) / 1000);
  const lng = baseLng + ((((h >> 8) & 0xff) - 128) / 1000);
  return [lat, lng];
}

function parseLatLng(location: string | undefined): [number, number] | null {
  if (!location) return null;
  const match = location.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
  if (match) return [parseFloat(match[1]), parseFloat(match[2])];
  return null;
}

export default function FoodMap({ listings }: { listings: FoodListing[] }) {
  const defaultCenter: [number, number] = [22.9734, 78.6569]; // India center

  const markers = listings.map((l) => {
    const parsed = parseLatLng(l.location);
    const [lat, lng] = parsed ?? pseudoRandomCoords(l.location);
    return { id: l.id, lat, lng, title: l.foodName, subtitle: l.location };
  });

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border">
      <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold">{m.title}</div>
                <div className="text-xs text-muted-foreground">{m.subtitle}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


