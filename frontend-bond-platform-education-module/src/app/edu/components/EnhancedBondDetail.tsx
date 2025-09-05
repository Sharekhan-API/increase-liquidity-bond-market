import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Building, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Star, 
  Download, 
  Share2, 
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Wallet,
  BarChart3,
  DollarSign,
  Globe,
  Phone,
  Mail,
  FileText,
  Target,
  Users,
  Award,
  Heart,
  Bell
} from "lucide-react";
// ImageWithFallback removed - not available in this context

interface EnhancedBondDetailProps {
  onBack: () => void;
  onBuyAction?: () => void;
}

export function EnhancedBondDetail({ onBack, onBuyAction }: EnhancedBondDetailProps) {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  const bondData = {
    name: "HDFC Bank Bond Series XV",
    issuer: "HDFC Bank Limited",
    isin: "INE040A08142",
    type: "Subordinated Tier II Bond",
    status: "Active Trading",
    listing: "BSE, NSE",
    
    // Pricing & Yield
    faceValue: 1000,
    currentPrice: 985.50,
    priceChange: -2.50,
    priceChangePercent: -0.25,
    currentYield: 8.45,
    yieldToMaturity: 8.52,
    couponRate: 8.25,
    couponFrequency: "Semi-Annual",
    
    // Maturity & Tenure
    issueDate: "2024-03-20",
    maturityDate: "2027-03-20",
    tenure: "3 years",
    daysToMaturity: 928,
    yearsToMaturity: 2.54,
    
    // Investment Details
    minInvestment: 25000,
    lotSize: 1,
    denomination: 1000,
    maxInvestment: 10000000,
    
    // Credit Information
    rating: "AAA",
    ratingAgency: "CRISIL",
    ratingOutlook: "Stable",
    ratingDate: "2024-01-15",
    ratingHistory: [
      { date: "2024-01-15", rating: "AAA", agency: "CRISIL" },
      { date: "2023-01-15", rating: "AAA", agency: "CRISIL" },
      { date: "2022-01-15", rating: "AA+", agency: "CRISIL" }
    ],
    
    // Risk Metrics
    riskLevel: "Low",
    creditRisk: "Very Low",
    interestRateRisk: "Moderate",
    liquidityRisk: "Low",
    
    // Financial Metrics
    duration: 2.8,
    modifiedDuration: 2.7,
    convexity: 12.3,
    spread: 120, // basis points over g-sec
    beta: 0.85,
    
    // Tax Information
    taxStatus: "Taxable",
    tdsApplicable: "Yes",
    tdsRate: "10%",
    
    // Market Data
    volume24h: 2500000,
    volumeAvg30d: 1800000,
    lastTraded: "2024-09-01 15:30:00",
    bid: 984.50,
    ask: 986.50,
    marketCap: 50000000000,
    outstandingAmount: 5000000000,
    
    // Performance
    performance1m: 1.2,
    performance3m: 2.8,
    performance6m: 4.1,
    performance1y: 8.5,
    performanceYtd: 6.2,
    
    // Next Coupon
    nextCouponDate: "2024-09-20",
    nextCouponAmount: 41.25,
    accruedInterest: 25.30
  };

  const issuerInfo = {
    companyName: "HDFC Bank Limited",
    sector: "Banking & Financial Services",
    subSector: "Private Sector Bank",
    marketCap: "₹12,45,678 Crores",
    netWorth: "₹2,34,567 Crores",
    debtToEquity: 0.15,
    creditRating: "AAA/Stable",
    foundedYear: 1994,
    headquarters: "Mumbai, Maharashtra",
    employees: 177000,
    website: "www.hdfcbank.com",
    ceo: "Sashidhar Jagdishan",
    
    recentFinancials: {
      revenue: "₹1,85,467 Crores",
      profit: "₹50,123 Crores",
      roa: "1.8%",
      roe: "16.2%",
      npa: "0.3%",
      provisioning: "0.8%",
      capitalAdequacy: "18.5%"
    },
    
    businessHighlights: [
      "Largest private sector bank in India",
      "Strong digital banking platform",
      "Diversified revenue streams",
      "Robust risk management practices",
      "Consistent profitability track record"
    ]
  };

  const payoutSchedule = [
    { date: "2024-09-20", amount: 4125, status: "upcoming", type: "coupon" },
    { date: "2025-03-20", amount: 4125, status: "scheduled", type: "coupon" },
    { date: "2025-09-20", amount: 4125, status: "scheduled", type: "coupon" },
    { date: "2026-03-20", amount: 4125, status: "scheduled", type: "coupon" },
    { date: "2026-09-20", amount: 4125, status: "scheduled", type: "coupon" },
    { date: "2027-03-20", amount: 104125, status: "scheduled", type: "maturity" }
  ];

  const advantages = [
    "AAA credit rating ensures highest safety level",
    "Regular semi-annual interest payments provide steady income",
    "Listed on major exchanges ensuring good liquidity",
    "Strong issuer fundamentals with consistent performance",
    "Attractive yield premium over government securities",
    "Suitable for conservative income-focused investors",
    "Transparent pricing and trading on exchanges",
    "Professional management and regulatory oversight"
  ];

  const risks = [
    "Interest rate risk - price falls if rates rise",
    "Credit risk though minimal with AAA rating",
    "Taxable interest income reduces post-tax returns",
    "Lower liquidity compared to government bonds",
    "Inflation risk may erode real returns over time",
    "Early redemption typically not available",
    "Concentration risk if large allocation to single issuer",
    "Subordinated nature ranks below senior debt"
  ];

  const comparableBonds = [
    {
      name: "ICICI Bank Tier II Bond",
      rating: "AAA",
      yield: 8.35,
      maturity: "2028-12-15",
      price: 992
    },
    {
      name: "Axis Bank Subordinated Bond",
      rating: "AA+",
      yield: 8.65,
      maturity: "2029-06-10",
      price: 978
    },
    {
      name: "SBI Tier II Bond Series",
      rating: "AAA",
      yield: 8.40,
      maturity: "2029-01-25",
      price: 988
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatLargeCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRiskColor = (risk: string) => {
    if (risk === "Very Low" || risk === "Low") return "text-green-600 bg-green-50 border-green-200";
    if (risk === "Moderate") return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getRatingColor = (rating: string) => {
    if (rating.startsWith("AAA")) return "bg-green-100 text-green-800 border-green-200";
    if (rating.startsWith("AA")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (rating.startsWith("A")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </div>

        {/* Main Bond Info Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="grid lg:grid-cols-12 gap-6 items-center">
              {/* Bond Info */}
              <div className="lg:col-span-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-white mb-2">{bondData.name}</h1>
                    <p className="text-blue-100 mb-3">{bondData.issuer}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        {bondData.type}
                      </Badge>
                      <Badge className={`${getRatingColor(bondData.rating)} border`}>
                        {bondData.rating}
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-100 border-green-400/30">
                        {bondData.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-blue-100">
                      ISIN: {bondData.isin} • Listed on: {bondData.listing}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Yield */}
              <div className="lg:col-span-3">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-blue-200">Current Price</div>
                    <div className="text-3xl font-bold text-white flex items-center gap-2">
                      ₹{bondData.currentPrice}
                      <span className={`text-sm font-medium ${bondData.priceChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                        {bondData.priceChange >= 0 ? '+' : ''}{bondData.priceChange} ({bondData.priceChangePercent}%)
                      </span>
                    </div>
                    <div className="text-sm text-blue-200">Face Value: ₹{bondData.faceValue}</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-200">Current Yield</div>
                    <div className="text-2xl font-bold text-green-300 flex items-center gap-1">
                      {bondData.currentYield}%
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="text-sm text-blue-200">YTM: {bondData.yieldToMaturity}%</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-3">
                <div className="space-y-3">
               
                  <div className="grid grid-cols-2 gap-2">
                  
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-blue-200 text-center">
                    Min Investment: {formatCurrency(bondData.minInvestment)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="bg-white border-t p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-500">Next Coupon</div>
                <div className="font-medium">{formatDate(bondData.nextCouponDate)}</div>
                <div className="text-xs text-green-600">₹{bondData.nextCouponAmount}/unit</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-medium">{bondData.duration} years</div>
                <div className="text-xs text-gray-500">Modified: {bondData.modifiedDuration}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">24h Volume</div>
                <div className="font-medium">{formatLargeCurrency(bondData.volume24h)}</div>
                <div className="text-xs text-gray-500">30d avg: {formatLargeCurrency(bondData.volumeAvg30d)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Maturity</div>
                <div className="font-medium">{formatDate(bondData.maturityDate)}</div>
                <div className="text-xs text-gray-500">{bondData.daysToMaturity} days</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Spread</div>
                <div className="font-medium">{bondData.spread} bps</div>
                <div className="text-xs text-gray-500">vs G-Sec</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issuer">Issuer</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="documents">Docs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Key Metrics */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Key Investment Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Yield to Maturity</span>
                          <span className="font-medium text-green-600">{bondData.yieldToMaturity}%</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Bid-Ask Spread</span>
                          <span className="font-medium">₹{(bondData.ask - bondData.bid).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Coupon Rate</span>
                          <span className="font-medium">{bondData.couponRate}%</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Coupon Frequency</span>
                          <span className="font-medium">{bondData.couponFrequency}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Total Issue Size</span>
                          <span className="font-medium">{formatLargeCurrency(bondData.outstandingAmount)}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Years to Maturity</span>
                          <span className="font-medium">{bondData.yearsToMaturity} years</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium">{bondData.duration} years</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Convexity</span>
                          <span className="font-medium">{bondData.convexity}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Beta</span>
                          <span className="font-medium">{bondData.beta}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Market Cap</span>
                          <span className="font-medium">{formatLargeCurrency(bondData.marketCap)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Price Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">1 Month</div>
                        <div className={`font-medium ${bondData.performance1m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {bondData.performance1m >= 0 ? '+' : ''}{bondData.performance1m}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">3 Months</div>
                        <div className={`font-medium ${bondData.performance3m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {bondData.performance3m >= 0 ? '+' : ''}{bondData.performance3m}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">6 Months</div>
                        <div className={`font-medium ${bondData.performance6m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {bondData.performance6m >= 0 ? '+' : ''}{bondData.performance6m}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">1 Year</div>
                        <div className={`font-medium ${bondData.performance1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {bondData.performance1y >= 0 ? '+' : ''}{bondData.performance1y}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">YTD</div>
                        <div className={`font-medium ${bondData.performanceYtd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {bondData.performanceYtd >= 0 ? '+' : ''}{bondData.performanceYtd}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Analysis & Investment Pros/Cons */}
              <div className="space-y-6">
                {/* Risk Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-orange-600" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Overall Risk Level</span>
                          <Badge className={`${getRiskColor(bondData.riskLevel)} border`}>
                            {bondData.riskLevel}
                          </Badge>
                        </div>
                        <Progress value={25} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">Based on credit rating, duration, and issuer profile</div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Credit Risk</span>
                          <Badge className={`${getRiskColor(bondData.creditRisk)} border text-xs`}>
                            {bondData.creditRisk}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Interest Rate Risk</span>
                          <Badge className={`${getRiskColor(bondData.interestRateRisk)} border text-xs`}>
                            {bondData.interestRateRisk}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Liquidity Risk</span>
                          <Badge className={`${getRiskColor(bondData.liquidityRisk)} border text-xs`}>
                            {bondData.liquidityRisk}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Investment Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Key Advantages
                        </h4>
                        <ul className="space-y-2">
                          {advantages.slice(0, 4).map((advantage, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Risk Considerations
                        </h4>
                        <ul className="space-y-2">
                          {risks.slice(0, 4).map((risk, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="h-1.5 w-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Issuer Tab */}
          <TabsContent value="issuer">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    About {issuerInfo.companyName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Sector</div>
                        <div className="font-medium">{issuerInfo.sector}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Sub-Sector</div>
                        <div className="font-medium">{issuerInfo.subSector}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Founded</div>
                        <div className="font-medium">{issuerInfo.foundedYear}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Headquarters</div>
                        <div className="font-medium">{issuerInfo.headquarters}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">CEO</div>
                        <div className="font-medium">{issuerInfo.ceo}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Employees</div>
                        <div className="font-medium">{issuerInfo.employees.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-3">Business Highlights</h4>
                      <ul className="space-y-2">
                        {issuerInfo.businessHighlights.map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Strength (FY24)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
                        <div className="font-medium text-lg">{issuerInfo.recentFinancials.revenue}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Net Profit</div>
                        <div className="font-medium text-lg text-green-600">{issuerInfo.recentFinancials.profit}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Return on Assets</div>
                        <div className="font-medium">{issuerInfo.recentFinancials.roa}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Return on Equity</div>
                        <div className="font-medium">{issuerInfo.recentFinancials.roe}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">NPA Ratio</div>
                        <div className="font-medium text-green-600">{issuerInfo.recentFinancials.npa}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Capital Adequacy</div>
                        <div className="font-medium text-blue-600">{issuerInfo.recentFinancials.capitalAdequacy}</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-3">Credit Rating History</h4>
                      <div className="space-y-2">
                        {bondData.ratingHistory.map((rating, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="text-sm">
                              <div className="font-medium">{formatDate(rating.date)}</div>
                              <div className="text-gray-500 text-xs">{rating.agency}</div>
                            </div>
                            <Badge className={`${getRatingColor(rating.rating)} border text-xs`}>
                              {rating.rating}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compare Tab */}
          <TabsContent value="compare">
            <Card>
              <CardHeader>
                <CardTitle>Similar Bonds Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Bond Name</th>
                        <th className="text-left py-3">Rating</th>
                        <th className="text-left py-3">Current Yield</th>
                        <th className="text-left py-3">Maturity</th>
                        <th className="text-left py-3">Price</th>
                        <th className="text-left py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b bg-blue-50">
                        <td className="py-3 font-medium">{bondData.name} (Current)</td>
                        <td className="py-3">
                          <Badge className={`${getRatingColor(bondData.rating)} border text-xs`}>
                            {bondData.rating}
                          </Badge>
                        </td>
                        <td className="py-3 font-medium text-green-600">{bondData.currentYield}%</td>
                        <td className="py-3">{formatDate(bondData.maturityDate)}</td>
                        <td className="py-3">₹{bondData.currentPrice}</td>
                        <td className="py-3">
                          <Badge variant="secondary">Viewing</Badge>
                        </td>
                      </tr>
                      {comparableBonds.map((bond, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3">{bond.name}</td>
                          <td className="py-3">
                            <Badge className={`${getRatingColor(bond.rating)} border text-xs`}>
                              {bond.rating}
                            </Badge>
                          </td>
                          <td className="py-3 font-medium">{bond.yield}%</td>
                          <td className="py-3">{formatDate(bond.maturity)}</td>
                          <td className="py-3">₹{bond.price}</td>
                          <td className="py-3">
                            <Button variant="outline" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Bond Documents & Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Official Documents</h4>
                    <div className="space-y-2">
                      {[
                        "Information Memorandum",
                        "Trust Deed",
                        "Rating Rationale - CRISIL",
                        "Audited Financial Statements",
                        "SEBI Compliance Certificate"
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Important Information</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-yellow-800">
                            <strong>Investment Risks:</strong> Please read the Information Memorandum carefully 
                            before investing. Past performance is not indicative of future results.
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-800">
                            <strong>Tax Implications:</strong> Interest income is taxable as per your income tax slab. 
                            TDS at 10% will be deducted if interest exceeds ₹5,000 annually.
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-green-800">
                            <strong>Regulatory Oversight:</strong> This bond is issued under SEBI regulations 
                            and is traded on recognized stock exchanges.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}