import { AnimationControls } from 'framer-motion';

// Animation variants for reuse across components
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6 }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.3 
    }
  }
};

// Define props type for components that use animation controls
export interface AnimatedSectionProps {
  controls: AnimationControls;
}
