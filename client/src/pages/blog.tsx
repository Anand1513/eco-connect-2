import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const posts = [
  {
    title: "Rescuing 1,200+ meals in Greater Noida",
    excerpt:
      "How restaurants and volunteers teamed up to reduce waste and feed communities.",
    date: "Oct 2024",
    category: "Impact",
  },
  {
    title: "Volunteer playbook: quick start guide",
    excerpt:
      "Best practices for pickup, storage, and distribution to keep food safe.",
    date: "Sep 2024",
    category: "Volunteer Tips",
  },
  {
    title: "Product updates: smarter listings and analytics",
    excerpt:
      "We’ve improved listing scheduling, map accuracy, and dashboard insights.",
    date: "Aug 2024",
    category: "Updates",
  },
  {
    title: "Partner spotlight: local NGOs making a difference",
    excerpt:
      "Meet the organizations ensuring rescued food reaches the right hands.",
    date: "Jul 2024",
    category: "Partners",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground mb-4">Blog</h1>
          <div className="flex gap-2 mb-4">
            <Badge>All</Badge>
            <Badge variant="secondary">Impact</Badge>
            <Badge variant="secondary">Updates</Badge>
            <Badge variant="secondary">Volunteer Tips</Badge>
            <Badge variant="secondary">Partners</Badge>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.title} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <CardDescription>{post.date}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {post.excerpt}
              </CardContent>
              <div className="px-6 pb-6 mt-auto">
                <Button variant="link" className="p-0">Read more</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}