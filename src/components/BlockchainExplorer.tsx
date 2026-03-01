import { motion, AnimatePresence } from 'framer-motion';
import { Box, Clock, Fuel, ArrowRight } from 'lucide-react';
import { useBlockchain } from '@/context/BlockchainContext';

export default function BlockchainExplorer() {
  const { transactions, blockHeight, gasPrice, networkStatus } = useBlockchain();

  return (
    <div className="glass-card-blue h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Box className="w-4 h-4 text-secondary" />
            Block Explorer
          </h3>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${networkStatus === 'online' ? 'bg-primary animate-glow-pulse' : 'bg-destructive'}`} />
            <span className="text-xs text-muted-foreground capitalize">{networkStatus}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-muted/50 rounded-lg p-2">
            <span className="text-muted-foreground">Block</span>
            <p className="font-mono neon-text-blue font-bold">#{blockHeight.toLocaleString()}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <span className="text-muted-foreground">Gas</span>
            <p className="font-mono neon-text-green font-bold">{gasPrice.toFixed(1)} Gwei</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="flex-1 overflow-y-auto scrollbar-web3 p-3 space-y-2">
        <AnimatePresence initial={false}>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No transactions yet
            </div>
          ) : (
            transactions.slice(0, 20).map((tx) => (
              <motion.div
                key={tx.id}
                className="bg-muted/30 rounded-lg p-3 border border-border/30"
                initial={{ opacity: 0, x: 20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                      tx.type === 'mint' ? 'bg-primary/20 text-primary' :
                      tx.type === 'purchase' ? 'bg-secondary/20 text-secondary' :
                      tx.type === 'escrow_lock' ? 'bg-accent/20 text-accent' :
                      tx.type === 'escrow_release' ? 'bg-primary/20 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {tx.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className={`text-xs font-mono flex items-center gap-1 ${
                    tx.status === 'confirmed' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {tx.status === 'pending' ? (
                      <><Clock className="w-3 h-3 animate-spin" /> Pending</>
                    ) : (
                      '✓ Confirmed'
                    )}
                  </span>
                </div>

                <p className="text-xs font-mono text-muted-foreground truncate mb-1">
                  {tx.txHash.slice(0, 20)}...{tx.txHash.slice(-8)}
                </p>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="truncate max-w-[80px] font-mono">{tx.from.slice(0, 10)}...</span>
                  <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="truncate max-w-[80px] font-mono">{tx.to.slice(0, 10)}...</span>
                </div>

                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span className="font-mono">{tx.value} RET</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Fuel className="w-3 h-3" /> {tx.gasFee.toFixed(5)} ETH
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
