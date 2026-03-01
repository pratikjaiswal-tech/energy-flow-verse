import { useBlockchain } from '@/context/BlockchainContext';
import { Activity, Play } from 'lucide-react';

export default function SimulationToggle() {
  const { simulationMode, toggleSimulation, runDemo, isProcessing } = useBlockchain();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={runDemo}
        disabled={isProcessing}
        className="btn-web3 text-xs px-3 py-1.5 flex items-center gap-1.5 disabled:opacity-40"
      >
        <Play className="w-3 h-3" />
        Demo
      </button>
      <button
        onClick={toggleSimulation}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
          simulationMode
            ? 'bg-primary/10 text-primary border border-primary/30'
            : 'bg-muted text-muted-foreground border border-border'
        }`}
      >
        <Activity className="w-3 h-3" />
        SIM {simulationMode ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}
