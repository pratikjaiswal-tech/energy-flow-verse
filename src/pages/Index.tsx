import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BlockchainProvider } from '@/context/BlockchainContext';
import HeroSection from '@/components/HeroSection';
import AppDashboard from '@/components/AppDashboard';

const Index = () => {
  const [entered, setEntered] = useState(false);

  return (
    <BlockchainProvider>
      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.div
            key="hero"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection onEnter={() => setEntered(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AppDashboard onBack={() => setEntered(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </BlockchainProvider>
  );
};

export default Index;
