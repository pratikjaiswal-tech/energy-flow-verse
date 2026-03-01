import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { useBlockchain } from '@/context/BlockchainContext';
import { useState } from 'react';

export default function MarketplaceGrid() {
  const { listings, buyEnergy, isProcessing } = useBlockchain();
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const handleBuy = async (id: string) => {
    setBuyingId(id);
    await buyEnergy(id);
    setTimeout(() => setBuyingId(null), 1000);
  };

  const availableListings = listings.filter(l => l.listed);

  if (availableListings.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
        <p className="text-sm text-muted-foreground">Switch to Producer role and generate energy to list tokens.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnimatePresence mode="popLayout">
        {availableListings.map((listing, i) => (
          <motion.div
            key={listing.id}
            className={`glass-card p-5 relative overflow-hidden ${listing.sold ? 'opacity-60' : ''}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: i * 0.05 }}
            whileHover={!listing.sold ? { scale: 1.02, y: -2 } : {}}
          >
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent" />

            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-mono text-muted-foreground truncate max-w-[180px]">
                  {listing.producer}
                </p>
                <p className="text-2xl font-bold font-mono neon-text-green mt-1">
                  {listing.amount} RET
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-lg font-bold font-mono neon-text-blue">
                  {listing.priceEth} ETH
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded bg-muted font-mono">ERC-20</span>
              <span className="px-2 py-1 rounded bg-muted font-mono">Polygon</span>
              {listing.sold && (
                <span className="px-2 py-1 rounded bg-primary/20 text-primary font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Sold
                </span>
              )}
            </div>

            {!listing.sold ? (
              <button
                onClick={() => handleBuy(listing.id)}
                disabled={isProcessing}
                className="w-full btn-energy text-sm flex items-center gap-2 justify-center"
              >
                {buyingId === listing.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <Lock className="w-4 h-4" />
                    Escrow Locking...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now
                  </>
                )}
              </button>
            ) : (
              <div className="w-full text-center py-3 text-sm text-primary font-mono">
                ✓ Transaction Complete
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
