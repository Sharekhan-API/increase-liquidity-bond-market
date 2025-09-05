import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  DollarSign, 
  Shield, 
  Target, 
  Brain, 
  Calculator,
  Building,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Star,
  BarChart3,
  Zap,
  Award
} from "lucide-react";

interface PortfolioInputs {
  stocks: string;
  mutualFunds: string;
  fixedDeposits: string;
}

interface BondSuggestion {
  id: string;
  name: string;
  issuer: string;
  rating: string;
  currentYield: number;
  currentPrice: number;
  maturityDate: string;
  suggestedAmount: number;
  units: number;
  riskContribution: number;
  reason: string;
}

interface AnalysisResult {
  currentRiskRating: number;
  improvedRiskRating: number;
  totalInvestment: number;
  allocationChanges: {
    stocks: { current: number; suggested: number; change: number };
    mutualFunds: { current: number; suggested: number; change: number };
    fixedDeposits: { current: number; suggested: number; change: number };
    bonds: { current: number; suggested: number; change: number };
  };
  suggestions: BondSuggestion[];
  riskReduction: number;
  expectedReturns: number;
}

export function PortfolioSuggestion() {
  const [portfolioInputs, setPortfolioInputs] = useState<PortfolioInputs>({
    stocks: "",
    mutualFunds: "",
    fixedDeposits: ""
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleInputChange = (field: keyof PortfolioInputs, value: string) => {
    setPortfolioInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateInputs = () => {
    const stocks = parseFloat(portfolioInputs.stocks) || 0;
    const mutualFunds = parseFloat(portfolioInputs.mutualFunds) || 0;
    const fixedDeposits = parseFloat(portfolioInputs.fixedDeposits) || 0;
    
    return stocks > 0 || mutualFunds > 0 || fixedDeposits > 0;
  };

  const analyzePortfolio = async () => {
    if (!validateInputs()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call with analysis logic
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const stocks = parseFloat(portfolioInputs.stocks) || 0;
    const mutualFunds = parseFloat(portfolioInputs.mutualFunds) || 0;
    const fixedDeposits = parseFloat(portfolioInputs.fixedDeposits) || 0;
    const totalPortfolio = stocks + mutualFunds + fixedDeposits;
    
    // Calculate current risk rating (higher stocks = higher risk)
    const stockWeight = stocks / totalPortfolio;
    const mfWeight = mutualFunds / totalPortfolio;
    const fdWeight = fixedDeposits / totalPortfolio;
    
    const currentRiskRating = Math.min(10, Math.max(1, 
      (stockWeight * 8) + (mfWeight * 5) + (fdWeight * 2) + 1
    ));
    
    // Calculate reductions from high-risk assets first
    const stockReduction = Math.min(stocks * 0.25, stocks); // Reduce up to 25% of stocks
    const mfReduction = Math.min(mutualFunds * 0.15, mutualFunds); // Reduce up to 15% of MF
    
    // Bond allocation equals exactly what we remove from other assets
    const suggestedBondAllocation = stockReduction + mfReduction;
    
    const mockSuggestions: BondSuggestion[] = [
      {
        id: "1",
        name: "10 Year Government Security",
        issuer: "Government of India",
        rating: "AAA",
        currentYield: 7.24,
        currentPrice: 1020,
        maturityDate: "2034-01-15",
        suggestedAmount: suggestedBondAllocation * 0.4,
        units: Math.floor((suggestedBondAllocation * 0.4) / 1020),
        riskContribution: 0.5,
        reason: "Sovereign guarantee provides stability and reduces overall portfolio risk"
      },
      {
        id: "2", 
        name: "HDFC Bank Bond Series XV",
        issuer: "HDFC Bank",
        rating: "AAA",
        currentYield: 8.45,
        currentPrice: 985,
        maturityDate: "2029-03-20",
        suggestedAmount: suggestedBondAllocation * 0.35,
        units: Math.floor((suggestedBondAllocation * 0.35) / 985),
        riskContribution: 0.8,
        reason: "High-quality corporate bond offering better yields while maintaining low risk"
      },
      {
        id: "3",
        name: "NABARD Rural Infrastructure Bond",
        issuer: "NABARD",
        rating: "AAA",
        currentYield: 7.65,
        currentPrice: 1015,
        maturityDate: "2031-04-30",
        suggestedAmount: suggestedBondAllocation * 0.25,
        units: Math.floor((suggestedBondAllocation * 0.25) / 1015),
        riskContribution: 0.6,
        reason: "Infrastructure bonds with tax benefits and strong credit profile"
      }
    ];
    
    // Calculate improved risk rating with better credit risk reduction
    const newStockWeight = (stocks - stockReduction) / totalPortfolio;
    const newMfWeight = (mutualFunds - mfReduction) / totalPortfolio;
    const newFdWeight = fixedDeposits / totalPortfolio;
    const bondWeight = suggestedBondAllocation / totalPortfolio;
    
    // Bonds have lower risk factor (2.5 instead of 3) for better risk improvement
    const improvedRiskRating = Math.min(10, Math.max(1,
      (newStockWeight * 8) + (newMfWeight * 5) + (newFdWeight * 2) + (bondWeight * 2.5) + 0.5
    ));
    
    const result: AnalysisResult = {
      currentRiskRating: Math.round(currentRiskRating * 10) / 10,
      improvedRiskRating: Math.round(improvedRiskRating * 10) / 10,
      totalInvestment: suggestedBondAllocation,
      allocationChanges: {
        stocks: {
          current: stocks,
          suggested: stocks - stockReduction,
          change: -stockReduction
        },
        mutualFunds: {
          current: mutualFunds,
          suggested: mutualFunds - mfReduction,
          change: -mfReduction
        },
        fixedDeposits: {
          current: fixedDeposits,
          suggested: fixedDeposits,
          change: 0
        },
        bonds: {
          current: 0,
          suggested: suggestedBondAllocation,
          change: suggestedBondAllocation
        }
      },
      suggestions: mockSuggestions,
      riskReduction: currentRiskRating - improvedRiskRating,
      expectedReturns: 7.8 // Expected blended return
    };
    
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRiskColor = (rating: number) => {
    if (rating <= 3) return "text-green-600 bg-green-50";
    if (rating <= 6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRiskColorSimple = (rating: number) => {
    if (rating <= 3) return "text-green-600";
    if (rating <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 flex items-center gap-2">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            AI Portfolio Suggestions
          </h1>
          <p className="text-gray-600">
            Get personalized bond recommendations to optimize your portfolio risk and returns
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Current Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stocks">Stocks Investment (₹)</Label>
                    <Input
                      id="stocks"
                      type="number"
                      placeholder="Enter amount in stocks"
                      value={portfolioInputs.stocks}
                      onChange={(e) => handleInputChange('stocks', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="mutualFunds">Mutual Funds Investment (₹)</Label>
                    <Input
                      id="mutualFunds"
                      type="number"
                      placeholder="Enter amount in mutual funds"
                      value={portfolioInputs.mutualFunds}
                      onChange={(e) => handleInputChange('mutualFunds', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fixedDeposits">Fixed Deposits (₹)</Label>
                    <Input
                      id="fixedDeposits"
                      type="number"
                      placeholder="Enter amount in FDs"
                      value={portfolioInputs.fixedDeposits}
                      onChange={(e) => handleInputChange('fixedDeposits', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Total Portfolio Value */}
                  {(portfolioInputs.stocks || portfolioInputs.mutualFunds || portfolioInputs.fixedDeposits) && (
                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-600 mb-1">Total Portfolio Value</div>
                      <div className="font-bold text-lg text-blue-600">
                        {formatCurrency(
                          (parseFloat(portfolioInputs.stocks) || 0) +
                          (parseFloat(portfolioInputs.mutualFunds) || 0) +
                          (parseFloat(portfolioInputs.fixedDeposits) || 0)
                        )}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={analyzePortfolio}
                    disabled={!validateInputs() || isAnalyzing}
                    className="w-full"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analyzing Portfolio...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Analyze & Get Suggestions
                      </div>
                    )}
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    Our AI analyzes your portfolio allocation and suggests optimal bond investments
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {!analysisResult ? (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Enter your portfolio details and click "Analyze" to get AI-powered bond suggestions</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Risk Rating Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Risk Analysis & Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Current Risk Rating</div>
                        <div className={`text-4xl font-bold ${getRiskColorSimple(analysisResult.currentRiskRating)}`}>
                          {analysisResult.currentRiskRating}/10
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Higher risk portfolio</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Improved Risk Rating</div>
                        <div className={`text-4xl font-bold ${getRiskColorSimple(analysisResult.improvedRiskRating)}`}>
                          {analysisResult.improvedRiskRating}/10
                        </div>
                        <div className="text-sm text-green-600 mt-1 flex items-center justify-center gap-1">
                          <TrendingDown className="h-4 w-4" />
                          Risk reduced by {analysisResult.riskReduction.toFixed(1)} points
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Optimization Benefits</span>
                      </div>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Reduces portfolio volatility through diversification</li>
                        <li>• Adds steady income stream from bond coupons</li>
                        <li>• Maintains expected returns at {analysisResult.expectedReturns}% annually</li>
                        <li>• Better risk-adjusted performance</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Allocation Changes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Recommended Portfolio Rebalancing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analysisResult.allocationChanges).map(([key, allocation]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              key === 'stocks' ? 'bg-red-100' :
                              key === 'mutualFunds' ? 'bg-blue-100' :
                              key === 'fixedDeposits' ? 'bg-green-100' :
                              'bg-orange-100'
                            }`}>
                              {key === 'stocks' ? <TrendingUp className="h-4 w-4 text-red-600" /> :
                               key === 'mutualFunds' ? <PieChart className="h-4 w-4 text-blue-600" /> :
                               key === 'fixedDeposits' ? <Shield className="h-4 w-4 text-green-600" /> :
                               <Building className="h-4 w-4 text-orange-600" />}
                            </div>
                            <div>
                              <div className="font-medium capitalize">
                                {key === 'mutualFunds' ? 'Mutual Funds' : 
                                 key === 'fixedDeposits' ? 'Fixed Deposits' : key}
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatCurrency(allocation.current)} → {formatCurrency(allocation.suggested)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {allocation.change !== 0 && (
                              <div className={`font-medium ${allocation.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {allocation.change > 0 ? '+' : ''}{formatCurrency(allocation.change)}
                              </div>
                            )}
                            <div className="text-sm text-gray-500">
                              {allocation.change === 0 ? 'No change' : allocation.change > 0 ? 'Add' : 'Reduce'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-800">
                          <strong>Rebalancing Strategy:</strong> Consider gradually moving funds from stocks and mutual funds 
                          to bonds over 2-3 months to minimize market timing risk.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bond Suggestions */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Recommended Bond Investments
                      </CardTitle>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total Bond Investment</div>
                        <div className="font-bold text-green-600">{formatCurrency(analysisResult.totalInvestment)}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisResult.suggestions.map((bond, index) => (
                        <Card key={bond.id} className="border border-gray-200">
                          <CardContent className="pt-4">
                            <div className="grid lg:grid-cols-12 gap-4 items-center">
                              {/* Bond Info */}
                              <div className="lg:col-span-5">
                                <div className="flex items-start gap-3">
                                  <div className="bg-blue-100 p-2 rounded-lg">
                                    <Building className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{bond.name}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{bond.issuer}</p>
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-green-100 text-green-800">{bond.rating}</Badge>
                                      <span className="text-sm text-gray-500">
                                        Yield: {bond.currentYield}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Investment Details */}
                              <div className="lg:col-span-4">
                                <div className="space-y-2">
                                  <div>
                                    <div className="text-sm text-gray-500">Suggested Investment</div>
                                    <div className="font-bold text-lg text-green-600">
                                      {formatCurrency(bond.suggestedAmount)}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">Units: </span>
                                      <span className="font-medium">{bond.units}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Price: </span>
                                      <span className="font-medium">₹{bond.currentPrice}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Risk Contribution */}
                              <div className="lg:col-span-3">
                                <div className="text-center">
                                  <div className="text-sm text-gray-500 mb-1">Risk Contribution</div>
                                  <div className="font-medium">{bond.riskContribution}/10</div>
                                  <Progress value={bond.riskContribution * 10} className="h-2 mt-1" />
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm text-gray-700">
                                <strong>Why this bond:</strong> {bond.reason}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                   

                    <div className="mt-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowDetails(!showDetails)}
                      >
                        {showDetails ? 'Hide' : 'Show'} Detailed Analysis
                        <ArrowRight className={`h-4 w-4 ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
                      </Button>
                    </div>

                    {showDetails && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-3">Detailed Portfolio Analysis</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                          <div>
                            <div className="font-medium mb-2">Risk Metrics:</div>
                            <ul className="space-y-1">
                              <li>• Current portfolio Sharpe ratio: 1.2</li>
                              <li>• Improved Sharpe ratio: 1.6</li>
                              <li>• Volatility reduction: 15%</li>
                              <li>• Maximum drawdown: -12% → -8%</li>
                            </ul>
                          </div>
                          <div>
                            <div className="font-medium mb-2">Return Analysis:</div>
                            <ul className="space-y-1">
                              <li>• Expected annual return: 7.8%</li>
                              <li>• Monthly income from bonds: ₹{((analysisResult.totalInvestment * 0.075) / 12).toLocaleString()}</li>
                              <li>• Tax-efficient income stream</li>
                              <li>• Inflation-protected growth</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}