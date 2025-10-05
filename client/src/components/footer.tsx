export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 64;
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  const quickLinks = [
    { label: "Home", id: "home" },
    { label: "About Us", id: "about" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Features", id: "features" },
    { label: "Contact", id: "contact" },
  ];

  const resources = [
    { label: "Blog", href: "#" },
    { label: "Success Stories", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Partners", href: "#" },
    { label: "Careers", href: "#" },
  ];

  const legal = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ];

  const socialLinks = [
    { icon: "fab fa-facebook-f", href: "#" },
    { icon: "fab fa-twitter", href: "#" },
    { icon: "fab fa-instagram", href: "#" },
    { icon: "fab fa-linkedin-in", href: "#" },
  ];

  return (
    <>
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Join the Movement Today
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Together, we can create a sustainable future where no food goes to waste and no one goes hungry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-4 bg-white text-primary rounded-lg font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-xl"
                data-testid="get-started-button"
              >
                Get Started Now
              </button>
              <button 
                className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/90 transition-all hover:scale-105 shadow-xl"
                data-testid="view-demo-button"
              >
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <i className="fas fa-leaf text-primary text-2xl"></i>
                  <span className="text-xl font-bold">EcoConnect</span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  Connecting communities to reduce food waste and create a sustainable future.
                </p>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => scrollToSection(link.id)}
                        className="text-white/70 hover:text-white transition-colors text-sm text-left"
                        data-testid={`footer-link-${link.id}`}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Resources */}
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  {resources.map((resource, index) => (
                    <li key={index}>
                      <a 
                        href={resource.href} 
                        className="text-white/70 hover:text-white transition-colors text-sm"
                        data-testid={`footer-resource-${index}`}
                      >
                        {resource.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Legal */}
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  {legal.map((item, index) => (
                    <li key={index}>
                      <a 
                        href={item.href} 
                        className="text-white/70 hover:text-white transition-colors text-sm"
                        data-testid={`footer-legal-${index}`}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-white/70 text-sm" data-testid="copyright-text">
                Copyright © EcoConnect 2025. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.href} 
                    className="text-white/70 hover:text-white transition-colors"
                    data-testid={`footer-social-${index}`}
                  >
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
