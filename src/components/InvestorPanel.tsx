import { motion } from 'framer-motion';
import { TrendingUp, Leaf, BarChart3 } from 'lucide-react';
import { useBlockchain } from '@/context/BlockchainContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const mockData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  production: Math.floor(Math.random() * 500 + 200),
  predicted: Math.floor(Math.random() * 600 + 300),
  carbon: Math.floor(Math.random() * 100 + 50),
}));

export default function InvestorPanel() {
  const { totalEnergyProduced, transactions } = useBlockchain();
  const sustainabilityScore = Math.min(100, Math.floor(totalEnergyProduced / 5 + 45));

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: BarChart3, label: 'Total Volume', value: `${totalEnergyProduced} RET`, color: 'neon-text-green' },
          { icon: TrendingUp, label: 'Est. ROI', value: '+12.4%', color: 'neon-text-blue' },
          { icon: Leaf, label: 'Sustainability', value: `${sustainabilityScore}/100`, color: 'neon-text-purple' },
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

      {/* Chart */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold mb-4">Energy Production & AI Prediction</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(210, 100%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(210, 100%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(228, 25%, 8%)',
                  border: '1px solid hsl(228, 20%, 15%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 40%, 92%)',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="production" stroke="hsl(142, 70%, 45%)" fill="url(#greenGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="predicted" stroke="hsl(210, 100%, 55%)" fill="url(#blueGrad)" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-6 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary rounded" /> Actual</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-secondary rounded border-dashed" /> AI Predicted</span>
        </div>
      </motion.div>

      {/* Carbon Offset */}
      <motion.div
        className="glass-card-purple p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          Carbon Offset Impact
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {(totalEnergyProduced * 0.42).toFixed(1)} kg CO₂ offset through renewable energy trading
        </p>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, hsl(142, 70%, 45%), hsl(210, 100%, 55%))' }}
            initial={{ width: 0 }}
            animate={{ width: `${sustainabilityScore}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
