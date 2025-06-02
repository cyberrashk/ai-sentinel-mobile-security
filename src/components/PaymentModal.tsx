
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Shield, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createPaymentSession } from '@/services/paymentService';

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

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const result = await createPaymentSession(planType);
      
      if (result.success) {
        // In a real app, redirect to Stripe checkout
        toast.success('Redirecting to payment...', {
          description: 'You will be redirected to secure checkout'
        });
        
        // Simulate redirect to payment processor
        setTimeout(() => {
          // Open payment URL in new tab (mock)
          window.open(result.paymentUrl, '_blank');
          onClose();
          
          // Simulate successful payment after 3 seconds
          setTimeout(() => {
            toast.success('Payment Successful!', {
              description: `Welcome to CyberGuard ${planType === 'premium' ? 'Premium' : 'Pro'}!`
            });
          }, 3000);
        }, 1000);
      }
    } catch (error) {
      toast.error('Payment Error', {
        description: 'Failed to initialize payment. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          
          <div className="border-t pt-4">
            <Button 
              className="w-full bg-cyberguard-primary hover:bg-cyberguard-primary/90"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay with Card
                </>
              )}
            </Button>
            
            <div className="text-xs text-gray-500 text-center mt-2">
              Secure payment powered by Stripe
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
