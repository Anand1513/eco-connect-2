import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Profiles = {
  restaurants: Array<{ id: string; username: string; organizationName?: string; address?: string }>;
  ngos: Array<{ id: string; username: string; organizationName?: string; address?: string }>;
};

export default function PublicProfiles() {
  const { data } = useQuery<Profiles>({ queryKey: ["/api/public/profiles"] });

  const openMaps = (address?: string) => {
    if (!address) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="profiles" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">Partners</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Restaurants & NGOs</h2>
          <p className="text-muted-foreground">Discover partners and visit them on Google Maps</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Restaurants</h3>
            <div className="grid gap-3">
              {(data?.restaurants || []).map((r) => (
                <Card key={r.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{r.organizationName || r.username}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{r.address || "Address not provided"}</div>
                    <Button size="sm" variant="outline" onClick={() => openMaps(r.address)}>Open in Maps</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">NGOs</h3>
            <div className="grid gap-3">
              {(data?.ngos || []).map((n) => (
                <Card key={n.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{n.organizationName || n.username}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{n.address || "Address not provided"}</div>
                    <Button size="sm" variant="outline" onClick={() => openMaps(n.address)}>Open in Maps</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


