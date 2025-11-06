import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const roles = [
  {
    title: "Frontend Engineer (React)",
    location: "Remote / Hybrid",
    desc: "Build smooth user flows for listings, maps, and dashboards.",
  },
  {
    title: "Partnerships Manager",
    location: "Greater Noida",
    desc: "Onboard restaurants and NGOs, streamline on-ground operations.",
  },
  {
    title: "Volunteer Coordinator",
    location: "Greater Noida",
    desc: "Train volunteers, manage pickups, ensure safety standards.",
  },
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Careers</h1>
        <p className="text-muted-foreground mb-6">Join the EcoConnect team — mission-driven, fast-moving, impact-first.</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <Card key={r.title}>
              <CardHeader>
                <CardTitle className="text-xl">{r.title}</CardTitle>
                <CardDescription>{r.location}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {r.desc}
                <div className="mt-4">
                  <Button variant="outline" asChild>
                    <a href="mailto:careers@ecoconnect.example?subject=Application: " target="_blank" rel="noreferrer">
                      Apply via Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Life at EcoConnect</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Impact over vanity metrics</li>
            <li>Ownership, curiosity, and kindness</li>
            <li>Flexible hours and field learning</li>
          </ul>
        </div>
      </div>
    </div>
  );
}