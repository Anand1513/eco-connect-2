import { useQuery, useMutation } from "@tanstack/react-query";
import { type FoodListing, type FoodClaim } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FoodMap from "@/components/food-map";
import { format } from "date-fns";
import { MapPin, Clock } from "lucide-react";

export default function VolunteerDashboard() {
  const { toast } = useToast();

  const { data: availableListings } = useQuery<FoodListing[]>({
    queryKey: ["/api/food-listings"],
    select: (data) => data.filter(l => l.status === 'available'),
  });

  const { data: myClaims } = useQuery<FoodClaim[]>({
    queryKey: ["/api/food-claims/my"],
  });

  const { data: allListings } = useQuery<FoodListing[]>({
    queryKey: ["/api/food-listings"],
  });

  const claimFoodMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const res = await apiRequest("POST", "/api/food-claims", {
        foodListingId: listingId,
        pickupStatus: "pending",
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/food-claims/my"] });
      toast({
        title: "Success!",
        description: "Food claimed successfully. Check My Claims tab for details.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateClaimStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/food-claims/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-claims/my"] });
      toast({
        title: "Success!",
        description: "Status updated successfully",
      });
    },
  });

  const getListingForClaim = (claim: FoodClaim) => {
    return allListings?.find(l => l.id === claim.foodListingId);
  };

  return (
    <Tabs defaultValue="available" className="w-full">
      <TabsList>
        <TabsTrigger value="available">Available Food</TabsTrigger>
        <TabsTrigger value="map">Map</TabsTrigger>
        <TabsTrigger value="my-claims">My Claims</TabsTrigger>
      </TabsList>

      <TabsContent value="available" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Available Food Listings</h3>
          {availableListings && availableListings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {availableListings.map((listing) => (
                <Card key={listing.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{listing.foodName}</CardTitle>
                      <Badge>{listing.quantity} {listing.unit}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{listing.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {format(new Date(listing.pickupTimeStart), "MMM d, h:mm a")} - {format(new Date(listing.pickupTimeEnd), "h:mm a")}
                      </div>
                      <div className="flex items-start text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        {listing.location}
                      </div>
                      <div className="pt-2">
                        <Badge variant="outline" className="capitalize">{listing.foodType.replace('_', ' ')}</Badge>
                      </div>
                      <Button
                        className="w-full mt-4"
                        onClick={() => claimFoodMutation.mutate(listing.id)}
                        disabled={claimFoodMutation.isPending}
                        data-testid={`claim-food-${listing.id}`}
                      >
                        Claim This Food
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No available food listings at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="map" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Pickup Locations Map</h3>
          {availableListings && availableListings.length > 0 ? (
            <FoodMap listings={availableListings} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No available food listings to display on the map.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="my-claims" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">My Claimed Food</h3>
          {myClaims && myClaims.length > 0 ? (
            <div className="grid gap-4">
              {myClaims.map((claim) => {
                const listing = getListingForClaim(claim);
                if (!listing) return null;
                return (
                  <Card key={claim.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{listing.foodName}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{listing.description}</p>
                        </div>
                        <Badge variant={claim.pickupStatus === 'completed' ? 'default' : claim.pickupStatus === 'pending' ? 'secondary' : 'outline'}>
                          {claim.pickupStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>
                            <p className="font-medium">{listing.quantity} {listing.unit}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="font-medium capitalize">{listing.foodType.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          {format(new Date(listing.pickupTimeStart), "MMM d, h:mm a")} - {format(new Date(listing.pickupTimeEnd), "h:mm a")}
                        </div>
                        <div className="flex items-start text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                          {listing.location}
                        </div>
                        {claim.pickupStatus === 'pending' && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => updateClaimStatusMutation.mutate({ id: claim.id, status: 'in_progress' })}
                              data-testid={`mark-in-progress-${claim.id}`}
                            >
                              Mark In Progress
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateClaimStatusMutation.mutate({ id: claim.id, status: 'completed' })}
                              data-testid={`mark-completed-${claim.id}`}
                            >
                              Mark Completed
                            </Button>
                          </div>
                        )}
                        {claim.pickupStatus === 'in_progress' && (
                          <Button
                            size="sm"
                            onClick={() => updateClaimStatusMutation.mutate({ id: claim.id, status: 'completed' })}
                            data-testid={`complete-claim-${claim.id}`}
                          >
                            Complete Pickup
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">You haven't claimed any food yet. Check the Available Food tab!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
