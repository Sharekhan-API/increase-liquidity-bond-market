export interface Bond {
  id: string;
  name: string;
  issuer: string;
  type: string;
  rating: string;
  currentPrice: number;
  currentYTM: number;
  couponRate: number;
  maturityDate: string;
  maxUnitsAvailable: number;
  heldQuantity: number;
  totalUnits: number;
  faceValue: number;
  remainingMonths?: number;
  investedAmount: number;
  nextCoupon: string;
}

// Legacy type aliases for backward compatibility
export type BondData = Bond;
export type PortfolioHolding = Bond;
export type NewBond = Bond;

export const allBonds: Bond[] = [
  {
    id: "1",
    name: "HDFC Bank Bond Series XV",
    issuer: "HDFC Bank",
    type: "Corporate",
    rating: "AAA",
    currentPrice: 980,
    currentYTM: 9.38,
    couponRate: 6.25,
    maturityDate: "2027-01-20",
    maxUnitsAvailable: 4,
    heldQuantity: 34,
    totalUnits: 100,
    faceValue: 1000,
    investedAmount: 49000,
    nextCoupon: "2024-10-20",
  },
  {
    id: "2",
    name: "10 Year Government Security",
    issuer: "Government of India",
    type: "Government",
    rating: "AAA",
    currentPrice: 1000,
    currentYTM: 6.95,
    couponRate: 5.95,
    maturityDate: "2026-01-15",
    maxUnitsAvailable: 0,
    heldQuantity: 100,
    totalUnits: 100,
    faceValue: 1000,
    investedAmount: 100000,
    nextCoupon: "2024-10-15",
  },
  {
    id: "3",
    name: "Reliance Industries Bond",
    issuer: "Reliance Industries",
    type: "Corporate",
    rating: "AAA",
    currentPrice: 1010,
    currentYTM: 8.26,
    couponRate: 7.50,
    maturityDate: "2026-06-15",
    maxUnitsAvailable: 70,
    heldQuantity: 25,
    totalUnits: 100,
    faceValue: 1000,
    investedAmount: 25250,
    nextCoupon: "2024-12-15",
  },
  {
    id: "4",
    name: "1 Year Government Security",
    issuer: "Government of India",
    type: "Government",
    rating: "AA",
    currentPrice: 1005,
    currentYTM: 7.68,
    couponRate: 6.80,
    maturityDate: "2026-06-20",
    maxUnitsAvailable: 20,
    heldQuantity: 0,
    totalUnits: 100,
    faceValue: 1000,
    investedAmount: 0,
    nextCoupon: "2024-12-22",
  },
  {
    id: "5",
    name: "Tata Steel Bond Series II",
    issuer: "Tata Steel Limited",
    type: "Corporate",
    rating: "AA+",
    currentPrice: 975,
    currentYTM: 9.02,
    couponRate: 7.80,
    maturityDate: "2026-09-10",
    maxUnitsAvailable: 4,
    heldQuantity: 0,
    totalUnits: 100,
    faceValue: 1000,
    investedAmount: 0,
    nextCoupon: "2025-01-09",
  },
  {
    id: "6",
    name: "YSL Y 2026",
    issuer: "Yves Saint Laurent",
    type: "Corporate",
    rating: "BBB-",
    currentPrice: 975,
    currentYTM: 9.92,
    couponRate: 8.80,
    maturityDate: "2026-04-14",
    maxUnitsAvailable: 43,
    heldQuantity: 0,
    totalUnits: 100,
    faceValue: 3240,
    investedAmount: 0,
    nextCoupon: "2025-01-09",
  },
  {
    id: "7",
    name: "Vodafone Idea Bond 2027",
    issuer: "Vodafone Idea Limited",
    type: "Corporate",
    rating: "B",
    currentPrice: 850,
    currentYTM: 19.25,
    couponRate: 12.50,
    maturityDate: "2027-03-15",
    maxUnitsAvailable: 85,
    heldQuantity: 0,
    totalUnits: 100,
    faceValue: 1000,
    investedAmount: 0,
    nextCoupon: "2025-03-15",
  },
  {
    id: "8",
    name: "Jet Airways Recovery Bond",
    issuer: "Jet Airways (India) Limited",
    type: "Corporate",
    rating: "C",
    currentPrice: 650,
    currentYTM: 18.75,
    couponRate: 15.00,
    maturityDate: "2026-12-31",
    maxUnitsAvailable: 92,
    heldQuantity: 0,
    totalUnits: 100,
    faceValue: 1000,
    investedAmount: 0,
    nextCoupon: "2025-06-30",
  },
  {
    id: "9",
    name: "Suzlon Energy Green Bond",
    issuer: "Suzlon Energy Limited",
    type: "Corporate",
    rating: "BB-",
    currentPrice: 780,
    currentYTM: 24.80,
    couponRate: 10.25,
    maturityDate: "2027-08-20",
    maxUnitsAvailable: 67,
    heldQuantity: 0,
    totalUnits: 100,
    faceValue: 1000,
    investedAmount: 0,
    nextCoupon: "2025-02-20",
  },
  {
    id: "10",
    name: "DHFL Housing Finance Bond",
    issuer: "Dewan Housing Finance Limited",
    type: "Corporate",
    rating: "D",
    currentPrice: 450,
    currentYTM: 23.50,
    couponRate: 18.00,
    maturityDate: "2026-05-10",
    maxUnitsAvailable: 95,
    heldQuantity: 0,
    totalUnits: 100,
    faceValue: 1000,
    investedAmount: 0,
    nextCoupon: "2025-05-10",
  },
  {
    id: "11",
    name: "Reliance Communications Bond",
    issuer: "Reliance Communications Limited",
    type: "Corporate",
    rating: "CC",
    currentPrice: 320,
    currentYTM: 28.90,
    couponRate: 16.50,
    maturityDate: "2025-11-30",
    maxUnitsAvailable: 88,
    heldQuantity: 0,
    totalUnits: 100,
    faceValue: 1000,
    investedAmount: 0,
    nextCoupon: "2025-05-30",
  },
];

// Helper functions to filter bonds - now deprecated, use BondStateManager instead
// These are kept for backward compatibility
export const getHeldBonds = (): Bond[] => {
  return allBonds.filter(bond => (bond.heldQuantity || 0) > 0);
};

export const getAvailableBonds = (): Bond[] => {
  return allBonds.filter(bond => bond.maxUnitsAvailable > 0);
};

export const getBondById = (id: string): Bond | undefined => {
  return allBonds.find(bond => bond.id === id);
};

// Legacy exports for backward compatibility
export const mockBondData: { [key: string]: Bond } = {
  ...Object.fromEntries(allBonds.map(bond => [bond.id, bond]))
};

export const portfolioHoldings: Bond[] = getHeldBonds();
export const newBonds: Bond[] = getAvailableBonds();

// Default portfolio summary - now calculated dynamically by BondStateManager
export const portfolioSummary = {
  totalValue: 850000,
  totalInvested: 800000,
  totalGain: 50000,
  gainPercentage: 6.25,
  monthlyIncome: 5680,
  ytdReturn: 8.2,
  avgYield: 7.8,
};
