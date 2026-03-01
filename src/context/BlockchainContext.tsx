import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type UserRole = 'producer' | 'consumer' | 'investor';

export interface Transaction {
  id: string;
  blockNumber: number;
  txHash: string;
  from: string;
  to: string;
  value: number;
  gasFee: number;
  timestamp: number;
  status: 'pending' | 'confirmed';
  type: 'mint' | 'list' | 'purchase' | 'escrow_lock' | 'escrow_release';
}

export interface EnergyListing {
  id: string;
  producer: string;
  amount: number;
  priceEth: number;
  listed: boolean;
  sold: boolean;
}

export interface BlockchainState {
  blockHeight: number;
  retBalance: number;
  ethBalance: number;
  transactions: Transaction[];
  listings: EnergyListing[];
  totalEnergyProduced: number;
  simulationMode: boolean;
  role: UserRole;
  networkStatus: 'online' | 'syncing' | 'offline';
  gasPrice: number;
}

interface BlockchainContextType extends BlockchainState {
  generateEnergy: (amount: number) => Promise<void>;
  listEnergy: (amount: number, price: number) => Promise<void>;
  buyEnergy: (listingId: string) => Promise<void>;
  setRole: (role: UserRole) => void;
  toggleSimulation: () => void;
  runDemo: () => Promise<void>;
  isProcessing: boolean;
}

const BlockchainContext = createContext<BlockchainContextType | null>(null);

const randomHash = () => '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
const randomAddr = () => '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

const PRODUCER_ADDR = '0xPr0duc3r...a1b2';
const CONSUMER_ADDR = '0xC0nsum3r...c3d4';
const ESCROW_ADDR = '0x3scr0w...e5f6';

export function BlockchainProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BlockchainState>({
    blockHeight: 18924531,
    retBalance: 0,
    ethBalance: 10.0,
    transactions: [],
    listings: [],
    totalEnergyProduced: 0,
    simulationMode: true,
    role: 'producer',
    networkStatus: 'online',
    gasPrice: 25,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const blockRef = useRef(state.blockHeight);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'blockNumber' | 'txHash' | 'timestamp' | 'gasFee' | 'status'>) => {
    return new Promise<Transaction>((resolve) => {
      blockRef.current += 1;
      const newTx: Transaction = {
        ...tx,
        id: crypto.randomUUID(),
        blockNumber: blockRef.current,
        txHash: randomHash(),
        timestamp: Date.now(),
        gasFee: +(Math.random() * 0.005 + 0.001).toFixed(6),
        status: 'pending',
      };

      setState(prev => ({
        ...prev,
        blockHeight: blockRef.current,
        gasPrice: +(Math.random() * 20 + 15).toFixed(1),
        transactions: [newTx, ...prev.transactions],
      }));

      // Confirm after delay
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          transactions: prev.transactions.map(t =>
            t.id === newTx.id ? { ...t, status: 'confirmed' as const } : t
          ),
        }));
        resolve({ ...newTx, status: 'confirmed' });
      }, 3000);
    });
  }, []);

  const generateEnergy = useCallback(async (amount: number) => {
    setIsProcessing(true);
    await addTransaction({
      from: '0x0000...0000',
      to: PRODUCER_ADDR,
      value: amount,
      type: 'mint',
    });
    setState(prev => ({
      ...prev,
      retBalance: prev.retBalance + amount,
      totalEnergyProduced: prev.totalEnergyProduced + amount,
    }));
    setIsProcessing(false);
  }, [addTransaction]);

  const listEnergy = useCallback(async (amount: number, price: number) => {
    if (state.retBalance < amount) return;
    setIsProcessing(true);
    const listing: EnergyListing = {
      id: crypto.randomUUID(),
      producer: PRODUCER_ADDR,
      amount,
      priceEth: price,
      listed: true,
      sold: false,
    };
    await addTransaction({
      from: PRODUCER_ADDR,
      to: ESCROW_ADDR,
      value: amount,
      type: 'list',
    });
    setState(prev => ({
      ...prev,
      retBalance: prev.retBalance - amount,
      listings: [listing, ...prev.listings],
    }));
    setIsProcessing(false);
  }, [state.retBalance, addTransaction]);

  const buyEnergy = useCallback(async (listingId: string) => {
    const listing = state.listings.find(l => l.id === listingId);
    if (!listing || listing.sold) return;
    setIsProcessing(true);

    // Escrow lock
    await addTransaction({
      from: CONSUMER_ADDR,
      to: ESCROW_ADDR,
      value: listing.amount,
      type: 'escrow_lock',
    });

    // Purchase
    await addTransaction({
      from: ESCROW_ADDR,
      to: CONSUMER_ADDR,
      value: listing.amount,
      type: 'purchase',
    });

    // Release
    await addTransaction({
      from: ESCROW_ADDR,
      to: listing.producer,
      value: listing.amount,
      type: 'escrow_release',
    });

    setState(prev => ({
      ...prev,
      ethBalance: prev.ethBalance - listing.priceEth,
      listings: prev.listings.map(l =>
        l.id === listingId ? { ...l, sold: true } : l
      ),
    }));
    setIsProcessing(false);
  }, [state.listings, addTransaction]);

  const setRole = useCallback((role: UserRole) => {
    setState(prev => ({ ...prev, role }));
  }, []);

  const toggleSimulation = useCallback(() => {
    setState(prev => ({ ...prev, simulationMode: !prev.simulationMode }));
  }, []);

  const runDemo = useCallback(async () => {
    setIsProcessing(true);
    // Step 1: Generate
    await generateEnergy(50);
    await new Promise(r => setTimeout(r, 1500));
    // Step 2: List
    await listEnergy(50, 0.05);
    await new Promise(r => setTimeout(r, 1500));
    // Step 3: Buy
    const latestListing = state.listings[0];
    if (latestListing) {
      await buyEnergy(latestListing.id);
    }
    setIsProcessing(false);
  }, [generateEnergy, listEnergy, buyEnergy, state.listings]);

  return (
    <BlockchainContext.Provider value={{
      ...state,
      generateEnergy,
      listEnergy,
      buyEnergy,
      setRole,
      toggleSimulation,
      runDemo,
      isProcessing,
    }}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const ctx = useContext(BlockchainContext);
  if (!ctx) throw new Error('useBlockchain must be used within BlockchainProvider');
  return ctx;
}
