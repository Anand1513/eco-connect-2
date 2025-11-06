import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-foreground">Partners</h1>
          <Link to="/auth"><Button size="lg">Become a Partner</Button></Link>
        </div>
        <p className="text-muted-foreground mb-6">
          Restaurants, NGOs, aur logistics teams milkar surplus food ko sahi jagah tak pahuchate hain.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Partners</CardTitle>
              <CardDescription>Surplus listings, safe packaging, timely handover</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Daily ya event-based surplus ko app par list karke pickup window set karte hain.
              Volunteers/NGOs request karte hain aur pickup complete hota hai.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NGO Partners</CardTitle>
              <CardDescription>Distribution networks, community programs</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Verified NGOs pickup ke baad food ko schools, shelters, aur community kitchens tak le jaate hain.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logistics Partners</CardTitle>
              <CardDescription>Cold chain, routing, fast delivery</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Jab quantities zyada hoti hain ya distance lamba hota hai, logistics partners help karte hain taaki safety bani rahe.
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Why partner with EcoConnect?</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Impact tracking: meals saved, kg rescued, delivery time</li>
            <li>Simple workflows: listings, pickup scheduling, confirmations</li>
            <li>Community reach: trusted NGOs and trained volunteers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}