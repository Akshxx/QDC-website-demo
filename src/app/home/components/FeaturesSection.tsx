"use client";
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Feature data definition
interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  accentColor: string;
}

// Separate FeatureCard component that can use hooks independently
const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  // Each card has its own useInView instance
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "-100px 0px"
  });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: inView ? index * 0.07 : 0 }}
      className="flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-transform hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`p-6 ${feature.color} h-full`}>
        <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm mb-4">
          {feature.icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
      </div>
      <div className={`h-1 ${feature.accentColor}`}></div>
    </motion.div>
  );
};

// Updated features data with 8 offerings and distinct colors
const features = [
  {
    title: "🚀 Hands-On Learning",
    description: "Experience real-world labs and projects using platforms like Google Cloud Skills Boost.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qwik-blue">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    color: "bg-qwik-blue/10",
    accentColor: "bg-qwik-blue"
  },
  {
    title: "🧠 Workshops & Bootcamps",
    description: "Upskill with sessions on cloud, AI/ML, Web Dev, DevOps, and more.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
        <path d="M4.5 9.5V5.5C4.5 4.4 5.4 3.5 6.5 3.5H17.5C18.6 3.5 19.5 4.4 19.5 5.5V9.5"></path>
        <path d="M4.5 14.5V18.5C4.5 19.6 5.4 20.5 6.5 20.5H17.5C18.6 20.5 19.5 19.6 19.5 18.5V14.5"></path>
        <path d="M2.5 12C2.5 11.17 3.17 10.5 4 10.5H20C20.83 10.5 21.5 11.17 21.5 12C21.5 12.83 20.83 13.5 20 13.5H4C3.17 13.5 2.5 12.83 2.5 12Z"></path>
      </svg>
    ),
    color: "bg-purple-500/10",
    accentColor: "bg-purple-500"
  },
  {
    title: "🏆 Hackathons",
    description: "Build, innovate, and compete in events like our flagship 36-hour HackRush.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qwik-red">
        <path d="M8 21H5a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h3"></path>
        <path d="M16 21h3a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1h-3"></path>
        <path d="M12 12h.01"></path>
        <path d="M12 16v-7"></path>
        <path d="M12 3v4"></path>
        <path d="M8 7h8"></path>
        <path d="M18 12l-6 8-6-8"></path>
      </svg>
    ),
    color: "bg-qwik-red/10",
    accentColor: "bg-qwik-red"
  },
  {
    title: "📜 Certification Support",
    description: "Get guidance and resources to ace global certifications in cloud and emerging tech.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
        <path d="M4 3v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3"></path>
        <path d="M8 3h8"></path>
        <path d="M12 7v10"></path>
        <path d="M12 7l-3 3"></path>
        <path d="M12 7l3 3"></path>
      </svg>
    ),
    color: "bg-indigo-500/10",
    accentColor: "bg-indigo-500"
  },
  {
    title: "💬 Peer-Led Community",
    description: "Learn, teach, and grow together in a collaborative student-driven environment.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qwik-green">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    color: "bg-qwik-green/10",
    accentColor: "bg-qwik-green"
  },
  {
    title: "🌐 Tech Talks & Events",
    description: "Stay ahead with expert sessions, tool-based workshops, and coding contests.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
      </svg>
    ),
    color: "bg-cyan-500/10",
    accentColor: "bg-cyan-500"
  },
  {
    title: "❤️ Outreach & Impact",
    description: "Give back to the community through social initiatives and mentorship programs.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      </svg>
    ),
    color: "bg-pink-500/10",
    accentColor: "bg-pink-500"
  },
  {
    title: "🌟 Industry Connections",
    description: "Connect with tech professionals and explore internship and career opportunities with our industry partners.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
        <path d="M12 3v3"></path>
        <path d="M18.5 8.5l-2.1 2.1"></path>
        <path d="M21 12h-3"></path>
        <path d="M18.5 15.5l-2.1-2.1"></path>
        <path d="M12 21v-3"></path>
        <path d="M5.5 15.5l2.1-2.1"></path>
        <path d="M3 12h3"></path>
        <path d="M5.5 8.5l2.1 2.1"></path>
        <circle cx="12" cy="12" r="4"></circle>
      </svg>
    ),
    color: "bg-amber-500/10",
    accentColor: "bg-amber-500"
  }
];

const FeaturesSection = () => {
  // Animation controls for the heading section
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false, // Changed to false to re-trigger when returning to page
    threshold: 0.1
  });

  // Start animations when section comes into view
  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
      });
    }
  }, [controls, inView]);

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Dive into the world of <span className="text-qwik-blue font-semibold">fun and learning</span> with our diverse range of opportunities
          </p>
        </motion.div>

        {/* Grid layout with feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
