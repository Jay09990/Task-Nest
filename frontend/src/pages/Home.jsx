import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Calendar,
  Users,
  Zap,
  Star,
  Menu,
  X,
  Home,
} from "lucide-react";

export default function TaskNestLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-purple-400" />,
      title: "Smart Task Management",
      description:
        "Organize, prioritize, and track your tasks with intelligent automation",
    },
    {
      icon: <Calendar className="w-8 h-8 text-blue-400" />,
      title: "Deadline Tracking",
      description:
        "Never miss a deadline with smart reminders and calendar integration",
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "Team Collaboration",
      description:
        "Work together seamlessly with real-time updates and shared workspaces",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Lightning Fast",
      description:
        "Optimized for speed with instant sync across all your devices",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager",
      content:
        "TaskNest transformed how our team manages projects. The intuitive interface and powerful features are game-changers.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Freelancer",
      content:
        "As a freelancer juggling multiple clients, TaskNest keeps me organized and productive. Highly recommend!",
      rating: 5,
    },
    {
      name: "Emma Davis",
      role: "Student",
      content:
        "Perfect for managing assignments and study schedules. The deadline tracking feature is incredibly helpful.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? "bg-black/20 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">TaskNest</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-white/80 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-white/80 hover:text-white transition-colors"
              >
                Testimonials
              </a>

              <a href="/register">
                <button className="border-2 border-white/30 text-white px-6 py-2 rounded-full hover:bg-white/10 transition-all">
                  Get Started
                </button>
              </a>
              <a href="/login">
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105">
                  Welcome Back
                </button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/40 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              <a
                href="#features"
                className="block text-white/80 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block text-white/80 hover:text-white transition-colors"
              >
                Testimonials
              </a>
              <a href="/register">
                <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg  hover:bg-white/10 transition-all">
                  Get Started
                </button>
              </a>
              <a href="/login">
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 text-lg rounded-full hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105">
                  Welcome Back
                </button>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              Organize Your
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                Life
              </span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            TaskNest helps you manage tasks, collaborate with teams, and achieve
            your goals with an intuitive and powerful task management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/login">
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-2xl">
                Welcome Back
              </button>
            </a>
            <a href="/register">
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all">
                Get Started
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Everything you need to stay organized and productive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Users Say
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Join thousands of satisfied users who've transformed their
              productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-white/90 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-white/70">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">TaskNest</span>
            </div>
            <div className="flex space-x-8">
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center">
            <p className="text-white/60">
              © 2025 TaskNest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
