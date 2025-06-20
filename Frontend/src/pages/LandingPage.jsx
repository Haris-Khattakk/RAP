import React from "react";
import { Building, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Building,
    title: "Rate Properties",
    description:
      "Share your honest reviews and ratings of properties you've lived in or visited.",
  },
  {
    icon: Building,
    title: "Connect with Community",
    description:
      "Follow users, build connections, and grow a network you trust.",
  },
  {
    icon: Building,
    title: "Engage & Discuss",
    description:
      "Comment, ask questions, and join real conversations around properties.",
  },
  {
    icon: Building,
    title: "Discover Quality",
    description: "Find top-rated properties based on genuine user experiences.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md border-b border-gray-700 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building className="w-7 h-7 text-white" />
            <h1 className="text-2xl font-bold tracking-tight">RateAProperty</h1>
          </div>
          <button
            onClick={() => navigate("/authentication/signin")}
            className="bg-white text-black px-5 py-2 rounded-md font-medium hover:bg-gray-200 transition-all"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 text-center relative">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Rate, Review &{" "}
            <span className="bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
              Discover
            </span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl mb-10">
            Real reviews. Real experiences. Your ultimate guide to trusted
            properties across the country.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/authentication/signin")}
              className="bg-white text-black px-6 py-3 rounded-md font-medium flex items-center justify-center hover:bg-gray-200 hover:scale-105 transition-all shadow"
            >
              Join Community <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="border border-gray-500 px-6 py-3 rounded-md hover:bg-gray-800 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-tr from-gray-800/80 to-gray-900/90">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-3">
            Why Choose Us?
          </h3>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands who rely on RateAProperty for genuine reviews,
            quality insights, and community trust.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-6 text-center border border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                <feature.icon className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-900/70 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          {[
            { value: "10K+", label: "Properties Rated" },
            { value: "5K+", label: "Active Users" },
            { value: "25K+", label: "Reviews Posted" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {stat.value}
              </div>
              <p className="text-gray-400 mt-2 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-800 to-black py-20 px-4 text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Get Started?
        </h3>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Join our growing community of property reviewers and help others make
          better decisions.
        </p>
        <button
          onClick={() => navigate("/authentication/signin")}
          className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 hover:scale-105 transition-all shadow flex items-center justify-center mx-auto"
        >
          Join Now – It's Free <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-700 py-8 px-4 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Building className="w-5 h-5 text-white" />
          <span className="font-semibold text-white">RateAProperty</span>
        </div>
        <p className="text-gray-500 text-sm">
          © 2024 RateAProperty. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
