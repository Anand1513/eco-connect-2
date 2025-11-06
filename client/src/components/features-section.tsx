export default function FeaturesSection() {
  const mainFeatures = [
    {
      icon: "fas fa-map-marked-alt",
      gradient: "from-primary to-primary/70",
      title: "Real-time Food Tracking",
      description: "Track available surplus food in real-time with live updates on quantities, locations, and pickup windows."
    },
    {
      icon: "fas fa-handshake",
      gradient: "from-secondary to-secondary/70",
      title: "Restaurant Collaboration",
      description: "Seamless onboarding and management system for restaurants to easily list and track their food donations."
    },
    {
      icon: "fas fa-user-friends",
      gradient: "from-primary to-primary/70",
      title: "Volunteer Management",
      description: "Coordinate volunteers efficiently with scheduling tools, route optimization, and performance tracking."
    },
    {
      icon: "fas fa-bullhorn",
      gradient: "from-secondary to-secondary/70",
      title: "Awareness & Campaigns",
      description: "Launch community campaigns and awareness programs to expand reach and engage more stakeholders."
    }
  ];

  const additionalFeatures = [
    {
      icon: "fas fa-shield-alt",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      title: "Food Safety Standards",
      description: "Built-in safety protocols ensure all food meets health standards and is handled properly throughout the process."
    },
    {
      icon: "fas fa-chart-line",
      iconBg: "bg-secondary/10",
      iconColor: "text-secondary",
      title: "Impact Analytics",
      description: "Detailed reports and analytics to track your environmental impact and community contribution over time."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Make an Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to streamline food redistribution and maximize community impact
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <i className={`${feature.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Additional Features */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 flex items-start space-x-6">
                <div className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <i className={`${feature.icon} ${feature.iconColor} text-xl`}></i>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
