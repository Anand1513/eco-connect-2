import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFoodListingSchema, type FoodListing } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Plus } from "lucide-react";

export default function RestaurantDashboard() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: listings, isLoading } = useQuery<FoodListing[]>({
    queryKey: ["/api/food-listings/my"],
  });

  const formSchema = insertFoodListingSchema
    .omit({ restaurantId: true })
    .extend({
      quantity: z.coerce.number().int().min(1),
      pickupTimeStart: z.preprocess((v) => (typeof v === 'string' ? new Date(v) : v), z.date()),
      pickupTimeEnd: z.preprocess((v) => (typeof v === 'string' ? new Date(v) : v), z.date()),
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodName: "",
      description: "",
      quantity: 1,
      unit: "servings",
      foodType: "prepared",
      pickupTimeStart: "",
      pickupTimeEnd: "",
      location: "",
    },
  });

  const createListingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/food-listings", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-listings/my"] });
      toast({
        title: "Success!",
        description: "Food listing created successfully",
      });
      form.reset();
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      quantity: Number(data.quantity),
      pickupTimeStart: data.pickupTimeStart ? new Date(data.pickupTimeStart) : undefined,
      pickupTimeEnd: data.pickupTimeEnd ? new Date(data.pickupTimeEnd) : undefined,
    };
    createListingMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">My Food Listings</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="create-listing-button">
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Food Listing</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="foodName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pizza, Sandwiches, Bread" {...field} data-testid="food-name-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional details about the food" {...field} data-testid="food-description-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} data-testid="food-quantity-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="food-unit-select">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="servings">Servings</SelectItem>
                            <SelectItem value="kg">Kilograms</SelectItem>
                            <SelectItem value="lbs">Pounds</SelectItem>
                            <SelectItem value="items">Items</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="foodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="food-type-select">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="prepared">Prepared Meals</SelectItem>
                          <SelectItem value="bakery">Bakery Items</SelectItem>
                          <SelectItem value="produce">Fresh Produce</SelectItem>
                          <SelectItem value="dairy">Dairy Products</SelectItem>
                          <SelectItem value="packaged">Packaged Goods</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pickupTimeStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Start *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            value={typeof field.value === 'string' ? field.value : field.value ? new Date(field.value).toISOString().slice(0,16) : ''}
                            onChange={(e) => field.onChange(e.target.value)}
                            data-testid="pickup-start-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pickupTimeEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup End *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            value={typeof field.value === 'string' ? field.value : field.value ? new Date(field.value).toISOString().slice(0,16) : ''}
                            onChange={(e) => field.onChange(e.target.value)}
                            data-testid="pickup-end-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full address" {...field} data-testid="pickup-location-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createListingMutation.isPending}
                  data-testid="submit-listing-button"
                >
                  {createListingMutation.isPending ? "Creating..." : "Create Listing"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{listing.foodName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{listing.description}</p>
                  </div>
                  <Badge variant={listing.status === 'available' ? 'default' : listing.status === 'claimed' ? 'secondary' : 'outline'}>
                    {listing.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <p className="font-medium">{listing.quantity} {listing.unit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium capitalize">{listing.foodType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pickup Window:</span>
                    <p className="font-medium">
                      {format(new Date(listing.pickupTimeStart), "MMM d, h:mm a")} - {format(new Date(listing.pickupTimeEnd), "h:mm a")}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-medium">{listing.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any food listings yet.</p>
            <Button onClick={() => setDialogOpen(true)}>Create Your First Listing</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
