import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { type FoodListing } from "@shared/schema";

// Narrow typing conflicts by casting components to any for prop compatibility
const MapContainerAny = MapContainer as any;
const TileLayerAny = TileLayer as any;

// Leaflet default icon fix for bundlers
// @ts-ignore - images provided by leaflet package
delete (L.Icon.Default as any).prototype._getIconUrl;
(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
});

function pseudoRandomCoords(seed: string): [number, number] {
  // Deterministic pseudo-random coordinates around Pari Chowk, Greater Noida
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const baseLat = 28.4743; // Pari Chowk latitude
  const baseLng = 77.5030; // Pari Chowk longitude
  const lat = baseLat + (((h & 0xff) - 128) / 3000);
  const lng = baseLng + ((((h >> 8) & 0xff) - 128) / 3000);
  return [lat, lng];
}

function parseLatLng(location: string | undefined): [number, number] | null {
  if (!location) return null;
  const match = location.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
  if (match) return [parseFloat(match[1]), parseFloat(match[2])];
  return null;
}

export default function FoodMap({ listings }: { listings: FoodListing[] }) {
  const defaultCenter: [number, number] = [28.4743, 77.5030]; // Pari Chowk, Greater Noida

  const markers = listings.map((l) => {
    const parsed = parseLatLng(l.location);
    const [lat, lng] = parsed ?? pseudoRandomCoords(l.location);
    return { id: l.id, lat, lng, title: l.foodName, subtitle: l.location };
  });

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border">
      <MapContainerAny center={defaultCenter} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayerAny
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
      </MapContainerAny>
    </div>
  );
}


