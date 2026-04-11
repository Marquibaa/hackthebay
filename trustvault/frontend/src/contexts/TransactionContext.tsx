import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type TransactionStatus = "sent" | "locked" | "shipped" | "delivered" | "released" | "disputed";

export type CryptoType = "ETH" | "USDT";

export interface Transaction {
  id: string;
  senderName: string;
  senderWallet: string;
  receiverName: string;
  receiverWallet: string;
  amount: number;
  crypto: CryptoType;
  description: string;
  status: TransactionStatus;
  txHash: string;
  createdAt: Date;
  autoReleaseAt: Date;
  disputed: boolean;
}

interface WalletState {
  connected: boolean;
  address: string;
  balanceETH: number;
  balanceUSDT: number;
}

interface TransactionContextType {
  transactions: Transaction[];
  wallet: WalletState;
  connectWallet: () => void;
  disconnectWallet: () => void;
  addTransaction: (tx: Omit<Transaction, "id" | "status" | "txHash" | "createdAt" | "autoReleaseAt" | "disputed">) => string;
  updateStatus: (id: string, status: TransactionStatus) => void;
  disputeTransaction: (id: string) => void;
  getTransaction: (id: string) => Transaction | undefined;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const generateTxHash = () => {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * 16)];
  return hash;
};

const generateWalletAddress = () => {
  const chars = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) addr += chars[Math.floor(Math.random() * 16)];
  return addr;
};

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: "",
    balanceETH: 0,
    balanceUSDT: 0,
  });

  const connectWallet = () => {
    setWallet({
      connected: true,
      address: generateWalletAddress(),
      balanceETH: parseFloat((Math.random() * 5 + 0.5).toFixed(4)),
      balanceUSDT: parseFloat((Math.random() * 5000 + 500).toFixed(2)),
    });
  };

  const disconnectWallet = () => {
    setWallet({ connected: false, address: "", balanceETH: 0, balanceUSDT: 0 });
  };

  const addTransaction = (tx: Omit<Transaction, "id" | "status" | "txHash" | "createdAt" | "autoReleaseAt" | "disputed">) => {
    const id = crypto.randomUUID();
    const now = new Date();
    const autoRelease = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    setTransactions((prev) => [
      ...prev,
      { ...tx, id, status: "locked", txHash: generateTxHash(), createdAt: now, autoReleaseAt: autoRelease, disputed: false },
    ]);
    if (tx.crypto === "ETH") {
      setWallet((w) => ({ ...w, balanceETH: Math.max(0, w.balanceETH - tx.amount) }));
    } else {
      setWallet((w) => ({ ...w, balanceUSDT: Math.max(0, w.balanceUSDT - tx.amount) }));
    }
    return id;
  };

  const updateStatus = (id: string, status: TransactionStatus) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, status } : tx)));
  };

  const disputeTransaction = (id: string) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, status: "disputed" as TransactionStatus, disputed: true } : tx)));
  };

  const getTransaction = (id: string) => transactions.find((tx) => tx.id === id);

  // Auto-release timer check
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTransactions((prev) =>
        prev.map((tx) => {
          if ((tx.status === "delivered" || tx.status === "shipped") && !tx.disputed && now >= tx.autoReleaseAt) {
            return { ...tx, status: "released" };
          }
          return tx;
        })
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TransactionContext.Provider value={{ transactions, wallet, connectWallet, disconnectWallet, addTransaction, updateStatus, disputeTransaction, getTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionProvider");
  return ctx;
};
