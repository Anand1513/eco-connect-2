export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              How EcoConnect Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to make a meaningful difference in your community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    1
                  </div>
                </div>
                <div className="mt-8 mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <i className="fas fa-clipboard-list text-primary text-3xl"></i>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">
                  Restaurants List Surplus Food
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Restaurants easily log their available surplus food through our platform, including quantity and pickup times.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    2
                  </div>
                </div>
                <div className="mt-8 mb-6">
                  <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <i className="fas fa-bell text-secondary text-3xl"></i>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">
                  NGOs & Volunteers Get Notified
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Instant notifications are sent to registered NGOs and volunteers in the area about available food.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    3
                  </div>
                </div>
                <div className="mt-8 mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <i className="fas fa-truck text-primary text-3xl"></i>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">
                  Food Collected & Distributed
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Volunteers collect the food and distribute it to those in need through partner organizations.
                </p>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Ready to be part of the solution?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
                data-testid="register-restaurant-button"
              >
                Register as Restaurant
              </button>
              <button 
                className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-all hover:scale-105 shadow-lg"
                data-testid="join-volunteer-button"
              >
                Join as Volunteer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
