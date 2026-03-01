import { motion } from 'framer-motion';
import { Zap, ShoppingCart, TrendingUp } from 'lucide-react';
import { useBlockchain, UserRole } from '@/context/BlockchainContext';

const roles: { id: UserRole; label: string; icon: typeof Zap; desc: string }[] = [
  { id: 'producer', label: 'Producer', icon: Zap, desc: 'Generate & list energy' },
  { id: 'consumer', label: 'Consumer', icon: ShoppingCart, desc: 'Buy & track tokens' },
  { id: 'investor', label: 'Investor', icon: TrendingUp, desc: 'Analytics & ROI' },
];

export default function RoleSelector() {
  const { role, setRole } = useBlockchain();

  return (
    <div className="flex gap-2">
      {roles.map(r => (
        <button
          key={r.id}
          onClick={() => setRole(r.id)}
          className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            role === r.id
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground bg-muted/30'
          }`}
        >
          {role === r.id && (
            <motion.div
              layoutId="role-bg"
              className="absolute inset-0 rounded-lg btn-energy"
              style={{ zIndex: -1 }}
              transition={{ type: 'spring', duration: 0.4 }}
            />
          )}
          <r.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{r.label}</span>
        </button>
      ))}
    </div>
  );
}
