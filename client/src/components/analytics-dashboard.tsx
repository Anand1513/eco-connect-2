import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Utensils, TrendingUp } from "lucide-react";

type Analytics = {
  totalMealsSaved: number;
  activeRestaurants: number;
  activeVolunteers: number;
  totalListings: number;
};

export default function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Community Impact</h2>
        <p className="text-muted-foreground">See the difference we're making together</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meals Saved</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-meals-saved">
              {analytics?.totalMealsSaved.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Meals prevented from going to waste
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Restaurants</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="active-restaurants">
              {analytics?.activeRestaurants || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Restaurants participating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="active-volunteers">
              {analytics?.activeVolunteers || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              NGOs and volunteers helping
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-listings">
              {analytics?.totalListings || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Food listings created
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Impact Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Making a Difference</h4>
            <p className="text-muted-foreground">
              Through the collective effort of our community, we've successfully prevented {analytics?.totalMealsSaved || 0} meals from going to waste.
              This represents not just food saved, but families fed, resources conserved, and a more sustainable future for all.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <h5 className="font-semibold text-primary mb-2">Environmental Impact</h5>
              <p className="text-sm text-muted-foreground">
                By reducing food waste, we're also reducing greenhouse gas emissions and conserving water and land resources.
              </p>
            </div>
            
            <div className="p-4 bg-secondary/5 rounded-lg">
              <h5 className="font-semibold text-secondary mb-2">Community Support</h5>
              <p className="text-sm text-muted-foreground">
                Every meal saved represents support for families in need, strengthening our community bonds.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
