"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, AnimatedSectionProps } from './AnimationTypes';
import { sectionContainer, sectionContent, cardContainer } from './SectionStyles';

// Track data
const tracks = [
  {
    id: "ml",
    title: "Track I: Machine Learning",
    topics: [
      "Algorithms and Models",
      "Feature Engineering",
      "Supervised Learning – Classification, Regression",
      "Unsupervised Learning",
      "Semi-supervised Learning",
      "Association Rule Mining",
      "Recommendation Systems",
      "Spatio-Temporal Learning",
      "Time Series Data"
    ]
  },
  {
    id: "ai",
    title: "Track II: AI & Deep Learning",
    topics: [
      "Heuristic Search, Nature Inspired Search",
      "Fuzzy and Rough Set",
      "Reinforcement Learning",
      "ANN and Deep Neural Networks",
      "RNN, CNN, RBM, Transformer",
      "Auto Encoder, GAN, Transfer Learning",
      "Generative AI: NLP, Computer Vision, Audio/Video Analytics",
      "AI Capabilities: Narrow AI, General AI, Super AI",
      "Interdisciplinary Applications"
    ]
  },
  {
    id: "cv",
    title: "Track III: Computer Vision & Image Processing",
    topics: [
      "Image Segmentation and Object Detection",
      "Image Classification and Recognition",
      "Feature Extraction and Description",
      "Deep Learning for Computer Vision",
      "3D Computer Vision and Stereo Vision",
      "Biomedical Image Analysis",
      "Video Analysis and Action Recognition",
      "Deepfake Detection and Image Forensics",
      "Hardware and Embedded Vision Systems"
    ]
  }
];

const TrackCard: React.FC<{ track: typeof tracks[0] }> = ({ track }) => {
  return (
    <motion.div variants={fadeIn} className={`${cardContainer} flex flex-col h-full`}>
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-4">
        <h3 className="text-xl font-bold text-white">{track.title}</h3>
      </div>
      <div className="p-5 sm:p-6 flex-grow">
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          {track.topics.map((topic, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{topic}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const TracksSection: React.FC<AnimatedSectionProps> = ({ controls }) => {
  return (
    <motion.section 
      id="tracks"
      className={sectionContainer}
      initial="hidden"
      animate={controls}
      variants={staggerContainer}
    >
      <motion.div variants={fadeIn} className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
          Tracks & Topics
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          The conference covers cutting-edge research areas across three main tracks
        </p>
      </motion.div>
      
      <div className={`${sectionContent} grid md:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6`}>
        {tracks.map(track => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </motion.section>
  );
};

export default TracksSection;
