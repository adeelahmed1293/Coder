import React from 'react';
import { ArrowRight, Play, CheckCircle2, Brain, Zap, Shield, Code, GitBranch, Star } from 'lucide-react';

import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="home" className="relative pt-16 sm:pt-20 pb-12 sm:pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8 inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-full text-xs sm:text-sm font-medium text-violet-800 border border-violet-200">
              <Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              AI-Powered Code Generation & Review
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Generate & Review
              <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                Code Intelligently
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Transform your development workflow with AI that generates clean, efficient code and provides 
              comprehensive reviews. Ship better software faster with intelligent assistance at every step.
            </p>
            
            <div className="flex justify-center items-center mb-12 sm:mb-16">
             <Link to="/login">
              <button className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg sm:rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-base sm:text-lg flex items-center">
                Start Coding Now
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto px-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">10M+</div>
                <div className="text-sm sm:text-base text-gray-600">Lines of Code Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">99.9%</div>
                <div className="text-sm sm:text-base text-gray-600">Code Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">500K+</div>
                <div className="text-sm sm:text-base text-gray-600">Code Reviews Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Powerful Features for Modern Development
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Everything you need to accelerate your development process with intelligent code generation and comprehensive review capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="Intelligent Code Generation"
              description="Generate clean, efficient code from natural language descriptions. Supports multiple programming languages and frameworks."
              gradient="from-violet-500 to-purple-600"
            />
            <FeatureCard
              icon={<GitBranch className="w-8 h-8" />}
              title="Comprehensive Code Review"
              description="Get detailed code analysis with suggestions for optimization, security improvements, and best practices."
              gradient="from-emerald-500 to-teal-600"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Lightning Fast Processing"
              description="Generate and review code in seconds with our optimized AI infrastructure and real-time analysis."
              gradient="from-amber-500 to-orange-600"
            />

            <FeatureCard
              icon={<Code className="w-8 h-8" />}
              title="Multi-Language Support"
              description="Support for 50+ programming languages including Python, JavaScript, Java, C++, Go, and more."
              gradient="from-blue-500 to-indigo-600"
            />
            <FeatureCard
              icon={<Star className="w-8 h-8" />}
              title="Quality Assurance"
              description="Automated testing suggestions and code quality metrics to maintain high standards across your projects."
              gradient="from-cyan-500 to-blue-600"
            />
          </div>
        </div>
      </section>



      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ready to Transform Your Development?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12">
            Join thousands of developers who are already building better software with AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            />
            <button className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm sm:text-base">
              Get Started
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient }) => (
  <div className="group p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
    <div className={`inline-flex p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { className: "w-6 h-6 sm:w-8 sm:h-8" })}
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{title}</h3>
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;