import { Link } from "wouter";

export default function Story() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              Our Story
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            How EcoConnect Came To Be
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            EcoConnect began with a simple but powerful idea: bridge the gap between surplus food and communities that need it.
            Restaurants often have perfectly good meals left at the end of the day, while NGOs and volunteers tirelessly work to
            feed those in need. We set out to make that connection seamless, safe, and scalable.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            By partnering with local restaurants, NGOs, and volunteers, our platform coordinates pickups, tracks impact, and ensures
            that food waste is minimized while more meals reach the people who need them. Every saved meal is a step toward a more
            sustainable and compassionate world.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Today, EcoConnect is a growing community. We’re proud of the progress we’ve made, and we’re excited about what comes next.
            Together, we can build a future where surplus food is an opportunity—not waste.
          </p>

          <Link href="/">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}