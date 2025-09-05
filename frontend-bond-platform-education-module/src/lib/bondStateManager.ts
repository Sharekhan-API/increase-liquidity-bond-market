import { Bond } from './mockData';

export interface BondTransaction {
  id: string;
  bondId: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
}

export class BondStateManager {
  private static STORAGE_KEY = 'bondPortfolioState';
  private static TRANSACTIONS_KEY = 'bondTransactions';

  // Get current bond state from localStorage or return default
  static getBondState(): Bond[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading bond state:', error);
    }
    
    // Return default state from mockData if no saved state
    const { allBonds } = require('./mockData');
    return [...allBonds];
  }

  // Save bond state to localStorage
  static saveBondState(bonds: Bond[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bonds));
    } catch (error) {
      console.error('Error saving bond state:', error);
    }
  }

  // Get transaction history
  static getTransactionHistory(): BondTransaction[] {
    try {
      const saved = localStorage.getItem(this.TRANSACTIONS_KEY);
      if (saved) {
        return JSON.parse(saved).map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
    return [];
  }

  // Save transaction to history
  static saveTransaction(transaction: Omit<BondTransaction, 'id' | 'timestamp'>): void {
    try {
      const transactions = this.getTransactionHistory();
      const newTransaction: BondTransaction = {
        ...transaction,
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date()
      };
      
      transactions.push(newTransaction);
      localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  }

  // Execute a buy transaction
  static buyBond(bondId: string, quantity: number): { success: boolean; message: string; updatedBonds?: Bond[] } {
    const bonds = this.getBondState();
    const bondIndex = bonds.findIndex(b => b.id === bondId);
    
    if (bondIndex === -1) {
      return { success: false, message: 'Bond not found' };
    }

    const bond = bonds[bondIndex];
    
    // Check if enough units are available
    if (bond.maxUnitsAvailable < quantity) {
      return { success: false, message: 'Insufficient units available' };
    }

    // Update bond state
    const updatedBond = {
      ...bond,
      heldQuantity: (bond.heldQuantity || 0) + quantity,
      maxUnitsAvailable: bond.maxUnitsAvailable - quantity,
      investedAmount: (bond.investedAmount || 0) + (quantity * bond.currentPrice)
    };

    bonds[bondIndex] = updatedBond;
    
    // Save updated state
    this.saveBondState(bonds);
    
    // Save transaction
    this.saveTransaction({
      bondId,
      type: 'buy',
      quantity,
      price: bond.currentPrice
    });

    return { success: true, message: 'Bond purchased successfully', updatedBonds: bonds };
  }

  // Execute a sell transaction
  static sellBond(bondId: string, quantity: number): { success: boolean; message: string; updatedBonds?: Bond[] } {
    const bonds = this.getBondState();
    const bondIndex = bonds.findIndex(b => b.id === bondId);
    
    if (bondIndex === -1) {
      return { success: false, message: 'Bond not found' };
    }

    const bond = bonds[bondIndex];
    
    // Check if enough units are held
    if ((bond.heldQuantity || 0) < quantity) {
      return { success: false, message: 'Insufficient units held' };
    }

    // Calculate average buy price for the units being sold
    const avgBuyPrice = bond.heldQuantity > 0 ? bond.investedAmount / bond.heldQuantity : bond.currentPrice;
    
    // Update bond state
    const updatedBond = {
      ...bond,
      heldQuantity: (bond.heldQuantity || 0) - quantity,
      maxUnitsAvailable: bond.maxUnitsAvailable + quantity,
      investedAmount: Math.max(0, (bond.investedAmount || 0) - (quantity * avgBuyPrice))
    };

    bonds[bondIndex] = updatedBond;
    
    // Save updated state
    this.saveBondState(bonds);
    
    // Save transaction
    this.saveTransaction({
      bondId,
      type: 'sell',
      quantity,
      price: bond.currentPrice
    });

    return { success: true, message: 'Bond sold successfully', updatedBonds: bonds };
  }

  // Get bonds that are currently held (heldQuantity > 0)
  static getHeldBonds(): Bond[] {
    return this.getBondState().filter(bond => (bond.heldQuantity || 0) > 0);
  }

  // Get bonds available for purchase (maxUnitsAvailable > 0)
  static getAvailableBonds(): Bond[] {
    return this.getBondState().filter(bond => bond.maxUnitsAvailable > 0);
  }

  // Get a specific bond by ID
  static getBondById(id: string): Bond | undefined {
    return this.getBondState().find(bond => bond.id === id);
  }

  // Reset to default state (useful for testing)
  static resetToDefault(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TRANSACTIONS_KEY);
  }

  // Calculate portfolio summary from current holdings
  static getPortfolioSummary() {
    const heldBonds = this.getHeldBonds();
    
    const totalInvested = heldBonds.reduce((sum, bond) => sum + (bond.investedAmount || 0), 0);
    const totalCurrentValue = heldBonds.reduce((sum, bond) => 
      sum + ((bond.heldQuantity || 0) * bond.currentPrice), 0
    );
    const totalGain = totalCurrentValue - totalInvested;
    const gainPercentage = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
    
    // Calculate monthly income (approximate based on coupon rates)
    const monthlyIncome = heldBonds.reduce((sum, bond) => {
      const annualCoupon = ((bond.heldQuantity || 0) * bond.faceValue * bond.couponRate) / 100;
      return sum + (annualCoupon / 12);
    }, 0);

    // Calculate average yield
    const totalFaceValue = heldBonds.reduce((sum, bond) => 
      sum + ((bond.heldQuantity || 0) * bond.faceValue), 0
    );
    const weightedYTM = heldBonds.reduce((sum, bond) => {
      const weight = ((bond.heldQuantity || 0) * bond.faceValue) / totalFaceValue;
      return sum + (bond.currentYTM * weight);
    }, 0);

    return {
      totalValue: totalCurrentValue,
      totalInvested,
      totalGain,
      gainPercentage,
      monthlyIncome,
      ytdReturn: gainPercentage, // Simplified - in real app this would be calculated differently
      avgYield: totalFaceValue > 0 ? weightedYTM : 0
    };
  }
}
