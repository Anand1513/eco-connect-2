import { useQuery } from "@tanstack/react-query";
import { type FoodListing } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import FoodMap from "@/components/food-map";

export default function ExploreSection() {
  const { data: listings } = useQuery<FoodListing[]>({ queryKey: ["/api/food-listings"] });
  const available = (listings || []).filter(l => l.status === 'available');

  return (
    <section id="explore" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Explore
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">See Available Surplus Near You</h2>
          <p className="text-muted-foreground">Discover food that restaurants are donating today</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            {available.length > 0 ? (
              <div className="grid gap-4">
                {available.map((listing) => (
                  <Card key={listing.id} className="border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{listing.foodName}</CardTitle>
                        <Badge>{listing.quantity} {listing.unit}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{listing.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center"><Clock className="mr-2 h-4 w-4" />
                          {format(new Date(listing.pickupTimeStart), "MMM d, h:mm a")} - {format(new Date(listing.pickupTimeEnd), "h:mm a")}
                        </div>
                        <div className="flex items-start"><MapPin className="mr-2 h-4 w-4 mt-0.5" /> {listing.location}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No available food listings right now. Check back later today.</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="sticky top-24">
            <FoodMap listings={available} />
          </div>
        </div>
      </div>
    </section>
  );
}


