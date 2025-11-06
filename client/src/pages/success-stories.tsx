import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const stories = [
  {
    title: "Weekend Rescue Drive",
    metrics: {
      meals: 420,
      kg: 180,
      partners: 8,
    },
    quote:
      "Hamari NGO ko timely deliveries mil gayi — bacchon ke liye garma-garam khana pahucha.",
    by: "Seva Foundation",
  },
  {
    title: "Festive Surplus Re-routed",
    metrics: {
      meals: 780,
      kg: 320,
      partners: 12,
    },
    quote:
      "Restaurants ne waste ko resource bana diya. Logistics aur volunteers ne kamaal kiya!",
    by: "Community Aid Network",
  },
  {
    title: "School Program Support",
    metrics: {
      meals: 300,
      kg: 120,
      partners: 5,
    },
    quote:
      "Stable supply se school ke lunch program me consistency aa gayi.",
    by: "Future Learners Trust",
  },
];

export default function SuccessStories() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Success Stories</h1>
        <p className="text-muted-foreground mb-6">
          Real impacts made by our partners and volunteers — yahan kuch highlights.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <Card key={s.title}>
              <CardHeader>
                <CardTitle className="text-xl">{s.title}</CardTitle>
                <CardDescription>EcoConnect ke saath milkar ground impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Meals saved</div>
                    <div className="text-2xl font-semibold">{s.metrics.meals}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Food rescued (kg)</div>
                    <div className="text-2xl font-semibold">{s.metrics.kg}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Partners involved</div>
                    <div className="text-2xl font-semibold">{s.metrics.partners}</div>
                  </div>
                </div>
                <blockquote className="mt-4 border-l-2 pl-3 text-sm text-foreground">
                  “{s.quote}”
                  <span className="block text-muted-foreground mt-1">— {s.by}</span>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}