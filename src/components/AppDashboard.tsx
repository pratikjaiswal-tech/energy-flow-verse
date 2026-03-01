import { motion } from 'framer-motion';
import { ArrowLeft, Wallet } from 'lucide-react';
import { useBlockchain } from '@/context/BlockchainContext';
import RoleSelector from './RoleSelector';
import SimulationToggle from './SimulationToggle';
import ProducerDashboard from './ProducerDashboard';
import MarketplaceGrid from './MarketplaceGrid';
import InvestorPanel from './InvestorPanel';
import BlockchainExplorer from './BlockchainExplorer';

interface Props {
  onBack: () => void;
}

export default function AppDashboard({ onBack }: Props) {
  const { role, ethBalance, retBalance } = useBlockchain();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">
              <span className="neon-text-green">⚡</span> EnergyChain
            </h1>
            <RoleSelector />
          </div>

          <div className="flex items-center gap-4">
            <SimulationToggle />
            <div className="glass-card px-3 py-1.5 flex items-center gap-2 text-xs font-mono">
              <Wallet className="w-3.5 h-3.5 text-secondary" />
              <span className="text-muted-foreground">{ethBalance.toFixed(3)} ETH</span>
              <span className="text-border">|</span>
              <span className="neon-text-green">{retBalance} RET</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto p-4">
        <div className="flex gap-4" style={{ minHeight: 'calc(100vh - 72px)' }}>
          {/* Main Panel */}
          <motion.div
            className="flex-1 min-w-0"
            key={role}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {role === 'producer' && <ProducerDashboard />}
            {role === 'consumer' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Marketplace</h2>
                  <p className="text-sm text-muted-foreground">Browse and purchase renewable energy tokens</p>
                </div>
                <MarketplaceGrid />
              </div>
            )}
            {role === 'investor' && <InvestorPanel />}
          </motion.div>

          {/* Explorer Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-[72px]" style={{ height: 'calc(100vh - 88px)' }}>
              <BlockchainExplorer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
