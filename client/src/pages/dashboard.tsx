import { useAuth } from "@/hooks/use-auth";
import RestaurantDashboard from "@/components/restaurant-dashboard";
import VolunteerDashboard from "@/components/volunteer-dashboard";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/");
      },
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <i className="fas fa-leaf text-primary text-2xl"></i>
              <span className="text-xl font-bold text-foreground">EcoConnect</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Welcome, </span>
                <span className="font-semibold text-foreground">{user.username}</span>
                <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold capitalize">
                  {user.role}
                </span>
              </div>
              <Button variant="outline" onClick={handleLogout} data-testid="logout-button">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="main" className="w-full">
          <TabsList>
            <TabsTrigger value="main">
              {user.role === 'restaurant' ? 'My Listings' : 'Available Food'}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="mt-6">
            {user.role === 'restaurant' ? (
              <RestaurantDashboard />
            ) : (
              <VolunteerDashboard />
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
