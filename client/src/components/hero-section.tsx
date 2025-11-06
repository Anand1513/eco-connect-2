import { Link } from "wouter";

export default function HeroSection() {
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      const offset = 64;
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="pt-16 relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Community food distribution and volunteering" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="max-w-3xl fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Connecting Communities, Reducing Food Waste
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
            EcoConnect bridges restaurants and NGOs to redistribute surplus food responsibly, creating a sustainable future for all.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth">
              <button 
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-xl"
                data-testid="join-us-today-button"
              >
                Join Us Today
              </button>
            </Link>
            <button 
              onClick={scrollToAbout}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all hover:scale-105"
              data-testid="learn-more-button"
            >
              Learn More
            </button>
          </div>
          
          {/* Impact Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2" data-testid="meals-saved-count">10K+</div>
              <div className="text-white/80 text-sm sm:text-base">Meals Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2" data-testid="restaurants-count">250+</div>
              <div className="text-white/80 text-sm sm:text-base">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2" data-testid="ngo-partners-count">50+</div>
              <div className="text-white/80 text-sm sm:text-base">NGO Partners</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <button 
          onClick={scrollToAbout}
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
          data-testid="scroll-down-indicator"
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <i className="fas fa-chevron-down animate-bounce-slow"></i>
        </button>
      </div>
    </section>
  );
}
