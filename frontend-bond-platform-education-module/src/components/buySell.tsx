import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import {
  ArrowLeft,
  Building,
  TrendingUp,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Plus,
  Minus
} from "lucide-react";
import { Bond } from "@/lib/mockData";


interface BuySellProps {
  bondData: Bond;
  transactionType: 'buy' | 'sell';
  onBack: () => void;
  onOrderPlaced: (quantity: number) => void;
}

export function BuySell({ bondData, transactionType, onBack, onOrderPlaced }: BuySellProps) {
  const [units, setUnits] = useState<string>("1");
  const [selectedValuation, setSelectedValuation] = useState<number>(3);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Calculate remaining months from maturity date
  const calculateRemainingMonths = (maturityDate: string): number => {
    if (maturityDate === "Perpetual") return 360; // Default for perpetual bonds
    
    const today = new Date();
    const maturity = new Date(maturityDate);
    
    const yearDiff = maturity.getFullYear() - today.getFullYear();
    const monthDiff = maturity.getMonth() - today.getMonth();
    
    let totalMonths = yearDiff * 12 + monthDiff;
    
    // Adjust for day of month
    if (maturity.getDate() < today.getDate()) {
      totalMonths--;
    }
    
    return Math.max(totalMonths, 0); // Ensure non-negative
  };

  const remainingMonths = calculateRemainingMonths(bondData.maturityDate);


  // Calculate available units based on transaction type
  const availableUnits = transactionType === 'buy' ? bondData.maxUnitsAvailable : (bondData.heldQuantity);
  const minUnits = 1;
  const maxUnits = availableUnits;


  // Valuation periods for cards - dynamically generated
  const generateValuationPeriods = () => {
    if (transactionType === 'sell') {
      // For selling, only show "Sell Now" (3 months) and "On Maturity"
      return [3, remainingMonths];
    }
    
    const periods = [];
    const maxDuration = Math.min(remainingMonths, 36);
    for (let i = 3; i <= maxDuration; i += 3) {
      periods.push(i);
    }
    // Add remaining months if it's not already included
    if (remainingMonths > 3 && remainingMonths % 3 !== 0) {
      periods.push(remainingMonths);
    }
    return periods.sort((a, b) => a - b);
  };

  const valuationPeriods = generateValuationPeriods();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Units validation
    if (!units) {
      newErrors.units = "Please enter number of units";
    } else {
      const unitsNum = parseInt(units);
      if (isNaN(unitsNum) || unitsNum <= 0) {
        newErrors.units = "Units must be a positive number";
      } else if (unitsNum < minUnits) {
        newErrors.units = `Minimum ${minUnits} unit required`;
      } else if (unitsNum > maxUnits) {
        newErrors.units = `Maximum ${maxUnits} units available`;
      }
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateReturns = (months: number, unitsCount: number) => {
    if (!unitsCount || unitsCount <= 0) return { totalValue: 0, returns: 0, returnPercentage: 0 };

    const principal = unitsCount * bondData.currentPrice;
    // New formula: returninterestforthatmonth = (currentyield/remainingmonths) * monthscalculatedfor
    const interestForPeriod = (bondData.currentYTM / remainingMonths) * months;
    const returns = (principal * interestForPeriod) / 100;
    const totalValue = principal + returns;
    const returnPercentage = (returns / principal) * 100;

    return {
      totalValue: totalValue,
      returns: returns,
      returnPercentage: returnPercentage
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onOrderPlaced(parseInt(units));
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const unitsCount = parseInt(units) || 0;
  const totalAmount = unitsCount * bondData.currentPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Button>
          <div>
            <h1 className="capitalize">
              {transactionType} Bond
            </h1>
            <p className="text-gray-600">
              {transactionType === 'buy' ? 'Purchase' : 'Sell'} {bondData.name}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Bond Info & Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bond Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Bond Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Bond Name</Label>
                      <p className="font-medium">{bondData.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Issuer</Label>
                      <p className="font-medium">{bondData.issuer}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Credit Rating</Label>
                      <p className="font-medium">{bondData.rating}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">{transactionType === 'buy' ? 'Current Price' : 'Avg Buy Price'}</Label>
                      <p className="font-medium">₹{bondData.currentPrice}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Current YTM</Label>
                      <p className="font-medium text-green-600">{bondData.currentYTM}%</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">{transactionType === 'buy' ? 'Max Available' : 'Held Units'}</Label>
                      <p className="font-medium">{availableUnits} units</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info Row */}
                <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Remaining Months</Label>
                      <p className="font-medium">{remainingMonths} months</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Maturity Date</Label>
                      <p className="font-medium">{bondData.maturityDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Units Selection with Plus/Minus */}
                  <div className="space-y-2">
                    <Label>
                      Number of Units to {transactionType === 'buy' ? 'Purchase' : 'Sell'} *
                    </Label>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={() => {
                          const currentUnits = parseInt(units) || 0;
                          if (currentUnits > minUnits) {
                            setUnits((currentUnits - 1).toString());
                          }
                        }}
                        disabled={parseInt(units) <= minUnits}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {units || 0}
                        </div>
                        <div className="text-xs text-gray-500">units</div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={() => {
                          const currentUnits = parseInt(units) || 0;
                          if (currentUnits < maxUnits) {
                            setUnits((currentUnits + 1).toString());
                          }
                        }}
                        disabled={parseInt(units) >= maxUnits}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {errors.units && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.units}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Available: {availableUnits} units • Min: {minUnits} unit
                    </p>
                  </div>

                  {/* Transaction Summary */}
                  {unitsCount > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-3">Transaction Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Units:</span>
                          <span className="font-medium">{unitsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Price per unit:</span>
                          <span className="font-medium">₹{bondData.currentPrice}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span className="text-blue-700">{transactionType === 'buy' ? 'Total Amount:' : 'Current Price:'}</span>
                          <span className="text-lg">{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading || !units}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Order...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Place {transactionType === 'buy' ? 'Buy' : 'Sell'} Order
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Valuation Cards */}
          <div className="space-y-6">
            {/* Valuation Period Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Projected Returns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Select a time period to see projected returns based on current YTM. Your selected duration will be used for the transaction.
                </p>


                {/* Selected Period Details */}
                {unitsCount > 0 && (
                  <div className="space-y-4 mb-3">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">
                          {selectedValuation} Month Projection (Selected Duration)
                        </span>
                      </div>

                      {(() => {
                        const calc = calculateReturns(selectedValuation, unitsCount);
                        return (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Initial Investment:</span>
                              <span className="font-medium">{formatCurrency(totalAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Expected Returns:</span>
                              <span className="font-medium text-green-600">
                                +{formatCurrency(calc.returns)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Value:</span>
                              <span className="font-medium text-lg">
                                {formatCurrency(calc.totalValue)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Return %:</span>
                              <span className="font-medium text-green-600">
                                +{calc.returnPercentage.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* All Periods Comparison */}
                {unitsCount > 0 && (
                  <div className="space-y-3">
                    {valuationPeriods.map((months) => {
                      const calc = calculateReturns(months, unitsCount);
                      const isThreeMonths = months === 3;
                      const isMaturity = months === remainingMonths;
                      
                      let cardLabel = `${months} Months`;
                      if (transactionType === 'sell') {
                        if (isThreeMonths) {
                          cardLabel = 'Sell Now';
                        } else if (isMaturity) {
                          cardLabel = `On Maturity (${months} months)`;
                        }
                      }
                      
                      return (
                        <div
                          key={months}
                          className={`p-3 rounded-lg border transition-colors ${
                            isMaturity && transactionType === 'sell'
                              ? 'cursor-not-allowed border-orange-300 bg-orange-100' 
                              : `cursor-pointer ${selectedValuation === months
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:bg-gray-50'
                                }`
                          }`}
                          onClick={() => {
                            if (!(isMaturity && transactionType === 'sell')) {
                              setSelectedValuation(months);
                            }
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{cardLabel}</div>
                              <div className="text-xs text-gray-500">
                                {transactionType === 'sell' && isThreeMonths 
                                  ? `Price: ₹${bondData.currentPrice + calc.returns/unitsCount} (incl. interest)`
                                  : `${calc.returnPercentage.toFixed(2)}% return`
                                }
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-green-600">
                                +{formatCurrency(calc.returns)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatCurrency(calc.totalValue)} total
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {unitsCount === 0 && (
                  <div className="text-center py-4">
                    <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Enter number of units to see projections
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Risk Disclaimer */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Disclaimer:</strong> Projected returns are estimates based on current yield and assume reinvestment of coupons.
                Actual returns may vary due to market conditions, interest rate changes, and credit risk.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}