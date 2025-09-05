import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Building, Calendar, TrendingUp, Shield, ArrowUpDown, Clock, Award, Target, Landmark } from "lucide-react";
import { EnhancedBondDetail } from "./EnhancedBondDetail";

interface Bond {
  id: string;
  name: string;
  issuer: string;
  type: "Government" | "Corporate" | "Municipal";
  rating: string;
  ratingAgency: string;
  currentYield: number;
  faceValue: number;
  currentPrice: number;
  maturityDate: string;
  tenure: string;
  couponRate: number;
  minInvestment: number;
  isWatchlisted: boolean;
  riskLevel: "Low" | "Medium" | "High";
}

export function BondSearch() {
  const [activeTab, setActiveTab] = useState("short-tenure");
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [showBondDetail, setShowBondDetail] = useState(false);

  const sampleBonds: Bond[] = [
    {
      id: "1",
      name: "10 Year Government Security",
      issuer: "Government of India",
      type: "Government",
      rating: "AAA",
      ratingAgency: "Sovereign",
      currentYield: 7.24,
      faceValue: 1000,
      currentPrice: 1020,
      maturityDate: "2034-01-15",
      tenure: "10 years",
      couponRate: 7.5,
      minInvestment: 10000,
      isWatchlisted: false,
      riskLevel: "Low"
    },
    {
      id: "2",
      name: "HDFC Bank Bond Series XV",
      issuer: "HDFC Bank",
      type: "Corporate",
      rating: "AAA",
      ratingAgency: "CRISIL",
      currentYield: 8.45,
      faceValue: 1000,
      currentPrice: 985.50,
      maturityDate: "2027-03-20",
      tenure: "3 years",
      couponRate: 8.25,
      minInvestment: 25000,
      isWatchlisted: true,
      riskLevel: "Low"
    },
    {
      id: "3",
      name: "Tata Motors Finance Bond",
      issuer: "Tata Motors Finance",
      type: "Corporate",
      rating: "AA+",
      ratingAgency: "ICRA",
      currentYield: 9.15,
      faceValue: 1000,
      currentPrice: 965,
      maturityDate: "2027-08-10",
      tenure: "3 years",
      couponRate: 9.0,
      minInvestment: 50000,
      isWatchlisted: false,
      riskLevel: "Medium"
    },
    {
      id: "4",
      name: "Maharashtra State Development Loan",
      issuer: "Government of Maharashtra",
      type: "Municipal",
      rating: "AA+",
      ratingAgency: "CARE",
      currentYield: 7.85,
      faceValue: 1000,
      currentPrice: 995,
      maturityDate: "2032-12-05",
      tenure: "8 years",
      couponRate: 7.8,
      minInvestment: 15000,
      isWatchlisted: false,
      riskLevel: "Low"
    },
    {
      id: "5",
      name: "Reliance Industries Bond",
      issuer: "Reliance Industries",
      type: "Corporate",
      rating: "AAA",
      ratingAgency: "CRISIL",
      currentYield: 8.25,
      faceValue: 1000,
      currentPrice: 1005,
      maturityDate: "2026-06-15",
      tenure: "2 years",
      couponRate: 8.3,
      minInvestment: 100000,
      isWatchlisted: true,
      riskLevel: "Low"
    },
    {
      id: "6",
      name: "NABARD Rural Infrastructure Bond",
      issuer: "NABARD",
      type: "Government",
      rating: "AAA",
      ratingAgency: "Sovereign",
      currentYield: 7.65,
      faceValue: 1000,
      currentPrice: 1015,
      maturityDate: "2031-04-30",
      tenure: "7 years",
      couponRate: 7.75,
      minInvestment: 20000,
      isWatchlisted: false,
      riskLevel: "Low"
    }
  ];

  const getRatingColor = (rating: string) => {
    if (rating === "AAA") return "bg-green-100 text-green-800";
    if (rating.startsWith("AA")) return "bg-blue-100 text-blue-800";
    if (rating.startsWith("A")) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "text-green-600";
    if (risk === "Medium") return "text-yellow-600";
    return "text-red-600";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter bonds by category
  const getFilteredBonds = (category: string) => {
    switch (category) {
      case "short-tenure":
        return sampleBonds.filter(bond => {
          const tenureYears = parseInt(bond.tenure.split(' ')[0]);
          return tenureYears <= 3;
        });
      case "high-rated":
        return sampleBonds.filter(bond => bond.rating === "AAA");
      case "high-returns":
        return sampleBonds.filter(bond => bond.currentYield >= 8.0).sort((a, b) => b.currentYield - a.currentYield);
      case "government-bonds":
        return sampleBonds.filter(bond => bond.type === "Government");
      default:
        return sampleBonds;
    }
  };

  const handleBondClick = (bond: Bond) => {
    if (bond.id === "2") { // HDFC Bank Bond Series XV
      setSelectedBond(bond);
      setShowBondDetail(true);
    }
  };

  const handleBackFromDetail = () => {
    setShowBondDetail(false);
    setSelectedBond(null);
  };

  const renderBondCard = (bond: Bond) => (
    <Card key={bond.id} className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="grid lg:grid-cols-12 gap-4 items-center">
          {/* Bond Info */}
          <div className="lg:col-span-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium mb-1">{bond.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{bond.issuer}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{bond.type}</Badge>
                  <Badge className={getRatingColor(bond.rating)}>
                    {bond.rating}
                  </Badge>
                  {bond.isWatchlisted && (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Yield & Price */}
          <div className="lg:col-span-3">
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-500">Current Yield</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-green-600">
                    {bond.currentYield}%
                  </span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Price</div>
                <div className="font-medium">
                  ₹{bond.currentPrice}
                  <span className="text-sm text-gray-500 ml-1">
                    (Face: ₹{bond.faceValue})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Maturity & Risk */}
          <div className="lg:col-span-3">
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-500">Maturity</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{new Date(bond.maturityDate).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="text-sm text-gray-500">{bond.tenure}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Risk Level</div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className={getRiskColor(bond.riskLevel)}>
                    {bond.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Info */}
          <div className="lg:col-span-2">
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-500">Min. Investment</div>
                <div className="font-medium">{formatCurrency(bond.minInvestment)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Coupon Rate</div>
                <div className="font-medium">{bond.couponRate}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4 pt-4 border-t">
          <Button 
            size="sm"
            onClick={() => handleBondClick(bond)}
            disabled={bond.id !== "2"}
          >
            {bond.id === "2" ? "View Details" : "Coming Soon"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (showBondDetail && selectedBond) {
    return (
      <EnhancedBondDetail 
        onBack={handleBackFromDetail}
        onBuyAction={() => console.log('Buy action for', selectedBond.name)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Bond Search & Discovery</h1>
          <p className="text-gray-600">
            Find the perfect bonds for your investment portfolio from government securities to corporate bonds
          </p>
        </div>

        {/* Bond Categories Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-24 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
            <TabsTrigger 
              value="short-tenure" 
              className="flex flex-col items-center justify-center h-20 space-y-2 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                <Clock className="h-4 w-4" />
              </div>
              <span>Short Tenure</span>
            </TabsTrigger>
            <TabsTrigger 
              value="high-rated" 
              className="flex flex-col items-center justify-center h-20 space-y-2 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                <Award className="h-4 w-4" />
              </div>
              <span>High Rated</span>
            </TabsTrigger>
            <TabsTrigger 
              value="high-returns" 
              className="flex flex-col items-center justify-center h-20 space-y-2 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600">
                <Target className="h-4 w-4" />
              </div>
              <span>High Returns</span>
            </TabsTrigger>
            <TabsTrigger 
              value="government-bonds" 
              className="flex flex-col items-center justify-center h-20 space-y-2 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600">
                <Landmark className="h-4 w-4" />
              </div>
              <span>Government Bonds</span>
            </TabsTrigger>
          </TabsList>

          {/* Short Tenure Tab */}
          <TabsContent value="short-tenure" className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-blue-900">Short Tenure Bonds</h3>
                    <p className="text-blue-700 mb-1">Bonds with maturity period of 3 years or less</p>
                    <span className="text-blue-600 text-sm font-medium">{getFilteredBonds('short-tenure').length + 8} bonds found</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort by Yield
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              {getFilteredBonds('short-tenure').map(renderBondCard)}
            </div>
          </TabsContent>

          {/* High Rated Tab */}
          <TabsContent value="high-rated" className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-green-900">High Rated Bonds</h3>
                    <p className="text-green-700 mb-1">AAA rated bonds with highest credit quality</p>
                    <span className="text-green-600 text-sm font-medium">{getFilteredBonds('high-rated').length} bonds found</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white hover:bg-green-50 border-green-200">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort by Rating
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              {getFilteredBonds('high-rated').map(renderBondCard)}
            </div>
          </TabsContent>

          {/* High Returns Tab */}
          <TabsContent value="high-returns" className="space-y-8">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-orange-900">High Returns Bonds</h3>
                    <p className="text-orange-700 mb-1">Bonds offering yields of 8% and above</p>
                    <span className="text-orange-600 text-sm font-medium">{getFilteredBonds('high-returns').length} bonds found</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white hover:bg-orange-50 border-orange-200">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort by Yield
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              {getFilteredBonds('high-returns').map(renderBondCard)}
            </div>
          </TabsContent>

          {/* Government Bonds Tab */}
          <TabsContent value="government-bonds" className="space-y-8">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 text-white">
                    <Landmark className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-purple-900">Government Bonds</h3>
                    <p className="text-purple-700 mb-1">Sovereign and government-backed securities</p>
                    <span className="text-purple-600 text-sm font-medium">{getFilteredBonds('government-bonds').length} bonds found</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white hover:bg-purple-50 border-purple-200">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort by Yield
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              {getFilteredBonds('government-bonds').map(renderBondCard)}
            </div>
          </TabsContent>
        </Tabs>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Bonds
          </Button>
        </div>
      </div>
    </div>
  );
}
