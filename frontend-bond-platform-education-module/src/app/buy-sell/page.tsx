"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BuySell } from "@/components/buySell";
import { Bond } from "@/lib/mockData";
import { BondStateManager } from "@/lib/bondStateManager";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function BuySellPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bondData, setBondData] = useState<Bond | null>(null);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    bondName: string;
    quantity: number;
    type: 'buy' | 'sell';
  } | null>(null);

  useEffect(() => {
    // Get bond data from URL parameters
    const bondId = searchParams.get('bondId');
    const type = searchParams.get('type') as 'buy' | 'sell';
    
    if (!bondId || !type) {
      router.push('/portfolio');
      return;
    }

    setTransactionType(type);

    const bond = BondStateManager.getBondById(bondId);
    if (bond) {
      setBondData(bond);
    } else {
      router.push('/portfolio');
    }
  }, [searchParams, router]);

  const handleBack = () => {
    router.push('/portfolio');
  };

  const handleOrderPlaced = (quantity: number) => {
    if (bondData) {
      let result;
      
      if (transactionType === 'buy') {
        result = BondStateManager.buyBond(bondData.id, quantity);
      } else {
        result = BondStateManager.sellBond(bondData.id, quantity);
      }
      
      if (result.success) {
        // Update the bond data with latest state
        const updatedBond = BondStateManager.getBondById(bondData.id);
        if (updatedBond) {
          setBondData(updatedBond);
        }
        
        setOrderDetails({
          bondName: bondData.name,
          quantity,
          type: transactionType
        });
        setShowSuccessDialog(true);
        
        // Trigger a custom event to notify other components of the state change
        window.dispatchEvent(new CustomEvent('bondStateChanged'));
      } else {
        alert(`Transaction failed: ${result.message}`);
      }
    }
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    setOrderDetails(null);
    router.push('/portfolio');
  };
  
  // Listen for bond state changes to update current bond data
  useEffect(() => {
    const handleBondStateChange = () => {
      if (bondData) {
        const updatedBond = BondStateManager.getBondById(bondData.id);
        if (updatedBond) {
          setBondData(updatedBond);
        }
      }
    };
    
    window.addEventListener('bondStateChanged', handleBondStateChange);
    return () => window.removeEventListener('bondStateChanged', handleBondStateChange);
  }, [bondData]);

  if (!bondData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bond details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BuySell
        bondData={bondData}
        transactionType={transactionType}
        onBack={handleBack}
        onOrderPlaced={handleOrderPlaced}
      />

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <DialogTitle className="text-lg font-semibold">
                Order Placed Successfully!
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              {orderDetails && (
                <>
                  Your {orderDetails.type} order for {orderDetails.quantity} units of{" "}
                  <span className="font-medium">{orderDetails.bondName}</span> has been placed successfully.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDialogClose} className="w-full">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
