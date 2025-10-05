export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              About EcoConnect
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Our Mission & Story
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Building a sustainable future through community-driven food redistribution
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Fresh produce at food bank" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                Reducing Food Waste, Feeding Communities
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                EcoConnect was born from a simple observation: while thousands go hungry every day, restaurants dispose of perfectly good surplus food. We knew there had to be a better way.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our platform connects restaurants with NGOs and volunteers, creating a seamless network for responsible food redistribution. Every meal saved is a step toward a more sustainable and compassionate world.
              </p>
              <div className="pt-4">
                <button 
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-all hover:scale-105 shadow-lg"
                  data-testid="read-full-story-button"
                >
                  Read Our Full Story
                </button>
              </div>
            </div>
          </div>
          
          {/* Impact Highlights */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
              Our Impact So Far
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-utensils text-primary text-2xl"></i>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2" data-testid="impact-meals-saved">10,000+</div>
                <div className="text-muted-foreground">Meals Saved</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-store text-secondary text-2xl"></i>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2" data-testid="impact-restaurant-partners">250+</div>
                <div className="text-muted-foreground">Restaurant Partners</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-hands-helping text-primary text-2xl"></i>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2" data-testid="impact-ngo-collaborations">50+</div>
                <div className="text-muted-foreground">NGO Collaborations</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users text-secondary text-2xl"></i>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2" data-testid="impact-active-volunteers">1,200+</div>
                <div className="text-muted-foreground">Active Volunteers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
