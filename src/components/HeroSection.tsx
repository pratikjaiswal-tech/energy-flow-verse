import { motion } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';
import EnergyScene from './3d/EnergyScene';

interface HeroSectionProps {
  onEnter: () => void;
}

export default function HeroSection({ onEnter }: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <EnergyScene />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60 z-10" />

      <div className="relative z-20 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
            <span className="text-sm font-mono text-muted-foreground">Polygon Testnet • Simulation Mode</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="neon-text-green">Energy</span>{' '}
          <span className="text-foreground">meets</span>
          <br />
          <span className="neon-text-blue">Blockchain</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          A decentralized peer-to-peer renewable energy marketplace.
          Mint, trade, and track energy tokens on-chain.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button
            onClick={onEnter}
            className="btn-energy text-lg flex items-center gap-2 justify-center"
          >
            <Zap className="w-5 h-5" />
            Enter Marketplace
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={onEnter}
            className="btn-web3 text-lg flex items-center gap-2 justify-center"
          >
            Demo Mode
          </button>
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center gap-12 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {[
            { label: 'Block Height', value: '#18,924,531' },
            { label: 'Gas Price', value: '25 Gwei' },
            { label: 'Network', value: 'Polygon' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="font-mono neon-text-green text-base">{item.value}</div>
              <div className="mt-1">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
