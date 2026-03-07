"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for our domain data
interface Subdomain {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface Domain {
  id: string;
  title: string;
  description: string;
  color: string;
  subdomains: Subdomain[];
}

// Domain data
const domains: Domain[] = [
  {
    id: "technical",
    title: "💻 Technical Domain",
    description: "The core of our innovation and development efforts — divided into two subdomains:",
    color: "blue",
    subdomains: [
      {
        id: "cloud",
        icon: "☁️",
        title: "Cloud Computing",
        description: "Focused on Google Cloud, hands-on labs, workshops, and helping members earn real-world certifications."
      },
      {
        id: "web",
        icon: "🌐",
        title: "Web Development",
        description: "Covers frontend & backend development, building real-world web apps and platforms used within and beyond QDC."
      }
    ]
  },
  {
    id: "creative",
    title: "🎨 Creatives Domain",
    description: "Responsible for visual storytelling — managing design, social media, content, and branding to bring QDC's vision to life.",
    color: "purple",
    subdomains: []
  },
  {
    id: "events",
    title: "🎤 Events Domain",
    description: "Handles end-to-end planning and execution of workshops, hackathons, outreach, and internal sessions — ensuring engaging experiences.",
    color: "green",
    subdomains: []
  },
  {
    id: "corporate",
    title: "🤝 Corporate Domain",
    description: "Drives industry connections, sponsorships, collaborations, and partnerships to support club growth and exposure.",
    color: "amber",
    subdomains: []
  }
];

const DomainSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("technical");

  // Get color values for different components
  const getButtonBgColor = (domainId: string) => {
    if (activeTab === domainId) {
      switch (domainId) {
        case "technical": return "rgb(59, 130, 246)"; // blue-500
        case "creative": return "rgb(168, 85, 247)";  // purple-500
        case "events": return "rgb(34, 197, 94)";     // green-500
        case "corporate": return "rgb(245, 158, 11)"; // amber-500
        default: return "rgb(59, 130, 246)";          // blue-500
      }
    }
    return "white"; // white for inactive tabs
  };

  const getContentBgColor = (domainId: string) => {
    switch (domainId) {
      case "technical": return "rgb(59, 130, 246)"; // blue-500
      case "creative": return "rgb(168, 85, 247)";  // purple-500
      case "events": return "rgb(34, 197, 94)";     // green-500
      case "corporate": return "rgb(245, 158, 11)"; // amber-500
      default: return "rgb(59, 130, 246)";          // blue-500
    }
  };

  const getTextColor = (domainId: string) => {
    switch (domainId) {
      case "technical": return "rgb(59, 130, 246)"; // blue-500
      case "creative": return "rgb(168, 85, 247)";  // purple-500
      case "events": return "rgb(34, 197, 94)";     // green-500
      case "corporate": return "rgb(245, 158, 11)"; // amber-500
      default: return "rgb(59, 130, 246)";          // blue-500
    }
  };

  // Animation variants
  const tabVariants = {
    active: {
      color: "white",
      scale: 1.05,
      transition: { duration: 0.3 }
    },
    inactive: {
      color: "rgb(55, 65, 81)", // text-gray-700
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Domains</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our specialized teams that collaborate to create the QDC experience
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {domains.map((domain) => (
            <motion.button
              key={domain.id}
              onClick={() => setActiveTab(domain.id)}
              className="px-6 py-3 rounded-full font-medium relative cursor-pointer"
              initial={false}
              animate={activeTab === domain.id ? "active" : "inactive"}
              variants={tabVariants}
              style={{
                backgroundColor: getButtonBgColor(domain.id),
                color: activeTab === domain.id ? "white" : "#4b5563"
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {domain.title.split(" ")[0]} {domain.title.split(" ")[1]}
            </motion.button>
          ))}
        </div>

        {/* Content Area with AnimatePresence for smooth transitions */}
        <div className="relative max-w-5xl mx-auto min-h-[400px]">
          <AnimatePresence mode="wait">
            {domains.map((domain) => (
              activeTab === domain.id && (
                <motion.div
                  key={domain.id}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={contentVariants}
                  className="rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-gray-900"
                >
                  <div className="px-6 py-8 md:px-8 text-white" style={{ backgroundColor: getContentBgColor(domain.id) }}>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">{domain.title}</h3>
                    <p className="text-lg md:text-xl opacity-90">{domain.description}</p>
                  </div>

                  <div className="p-6 md:p-8">
                    {domain.subdomains && domain.subdomains.length > 0 ? (
                      <motion.div 
                        className="grid md:grid-cols-2 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                      >
                        {domain.subdomains.map((subdomain, index) => (
                          <motion.div
                            key={subdomain.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (index * 0.1), duration: 0.4 }}
                            className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex items-center mb-3">
                              <span className="text-3xl mr-3">{subdomain.icon}</span>
                              <h4 className="text-xl font-semibold">{subdomain.title}</h4>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{subdomain.description}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="py-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                      >
                        <p className="text-lg text-gray-700 dark:text-gray-300">{domain.description}</p>
                        <motion.div 
                          className="mt-6 flex justify-center"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
                        >
                          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ color: getTextColor(domain.id) }}>
                            <span className="text-4xl">{domain.title.split(" ")[0]}</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default DomainSection;
