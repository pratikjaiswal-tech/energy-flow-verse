import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Battery, Coins, Loader2, Sun, Wind } from 'lucide-react';
import { useBlockchain } from '@/context/BlockchainContext';
import { useState } from 'react';

export default function ProducerDashboard() {
  const { retBalance, totalEnergyProduced, generateEnergy, listEnergy, isProcessing, gasPrice, listings } = useBlockchain();
  const [mintAnimation, setMintAnimation] = useState(false);
  const [listAmount, setListAmount] = useState(50);
  const [listPrice, setListPrice] = useState(0.05);

  const handleGenerate = async () => {
    setMintAnimation(true);
    await generateEnergy(50);
    setTimeout(() => setMintAnimation(false), 2000);
  };

  const handleList = async () => {
    if (retBalance >= listAmount) {
      await listEnergy(listAmount, listPrice);
    }
  };

  const listedCount = listings.filter(l => l.listed && !l.sold).length;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Battery, label: 'Total Energy', value: `${totalEnergyProduced} kWh`, color: 'neon-text-green' },
          { icon: Coins, label: 'RET Balance', value: `${retBalance} RET`, color: 'neon-text-blue' },
          { icon: Wind, label: 'Active Listings', value: `${listedCount}`, color: 'neon-text-purple' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Energy Generation */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-primary" />
          Energy Generation
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Generate solar energy and mint RET tokens. 1 kWh = 1 RET.
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={isProcessing}
            className="btn-energy flex items-center gap-2"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            Generate 50 kWh
          </button>

          <span className="text-xs font-mono text-muted-foreground">
            Gas: {gasPrice.toFixed(1)} Gwei
          </span>
        </div>

        <AnimatePresence>
          {mintAnimation && (
            <motion.div
              className="mt-4 p-3 rounded-lg border border-primary/30 bg-primary/5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
                <span className="text-sm font-mono neon-text-green">
                  ⛏ Mining block... 50 RET minted on-chain
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* List Energy */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5 text-secondary" />
          List on Marketplace
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Amount (RET)</label>
            <input
              type="number"
              value={listAmount}
              onChange={e => setListAmount(+e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Price (ETH)</label>
            <input
              type="number"
              step="0.01"
              value={listPrice}
              onChange={e => setListPrice(+e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <button
          onClick={handleList}
          disabled={isProcessing || retBalance < listAmount}
          className="btn-web3 flex items-center gap-2 disabled:opacity-40"
        >
          List {listAmount} RET for {listPrice} ETH
        </button>
      </motion.div>
    </div>
  );
}
