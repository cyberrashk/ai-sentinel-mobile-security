
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Shield, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createPaymentSession, processPayment } from '@/services/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'premium' | 'pro';
  planPrice: string;
  planFeatures: string[];
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  planType,
  planPrice,
  planFeatures
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  const handleInitiatePayment = async () => {
    console.log('Initiating payment for plan:', planType);
    setIsProcessing(true);
    
    try {
      const result = await createPaymentSession(planType);
      console.log('Payment session result:', result);
      
      if (result.success) {
        setSessionId(result.sessionId);
        setShowPaymentForm(true);
        toast.success('Payment session created', {
          description: 'Please enter your payment details'
        });
      } else {
        throw new Error('Failed to create payment session');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Payment Error', {
        description: 'Failed to initialize payment. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessPayment = async () => {
    console.log('Processing payment for session:', sessionId);
    setIsProcessing(true);
    
    try {
      const paymentResult = await processPayment(sessionId, {
        cardNumber: '****-****-****-1234',
        planType,
        amount: planPrice
      });
      
      console.log('Payment result:', paymentResult);
      
      if (paymentResult.success) {
        toast.success('Payment Successful!', {
          description: `Welcome to CyberGuard ${planType === 'premium' ? 'Premium' : 'Pro'}!`
        });
        
        // Store upgrade status
        localStorage.setItem('cyberguard_plan', planType);
        localStorage.setItem('cyberguard_upgrade_date', new Date().toISOString());
        
        // Reset modal state
        setShowPaymentForm(false);
        setSessionId('');
        onClose();
        
        // Refresh page to update UI
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment Failed', {
        description: 'Your payment could not be processed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setShowPaymentForm(false);
    setSessionId('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-cyberguard-primary" />
            Upgrade to {planType === 'premium' ? 'Premium' : 'Pro'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyberguard-primary">{planPrice}</div>
            <div className="text-sm text-gray-500">per month</div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">What's included:</h4>
            {planFeatures.map((feature, index) => (
              <div key={index} className="flex items-center text-sm">
                <Check className="w-4 h-4 mr-2 text-cyberguard-success" />
                {feature}
              </div>
            ))}
          </div>
          
          {!showPaymentForm ? (
            <div className="border-t pt-4">
              <Button 
                className="w-full bg-cyberguard-primary hover:bg-cyberguard-primary/90"
                onClick={handleInitiatePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Continue to Payment
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="border-t pt-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Mock Payment Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Card: **** **** **** 1234</div>
                  <div>Expiry: 12/25</div>
                  <div>CVC: ***</div>
                  <div>Plan: {planType}</div>
                  <div>Amount: {planPrice}</div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-cyberguard-primary hover:bg-cyberguard-primary/90"
                onClick={handleProcessPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Complete Payment ({planPrice})
                  </>
                )}
              </Button>
              
              <div className="text-xs text-gray-500 text-center">
                This is a demo payment - no real charges will be made
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
