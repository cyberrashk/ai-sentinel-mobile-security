
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Shield } from 'lucide-react';

interface HeroSectionProps {
  onScan: () => void;
  onExploreFeatures: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScan, onExploreFeatures }) => {
  return (
    <section className="mb-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyberguard-primary to-cyberguard-secondary text-white">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          ))}
        </div>
        <div className="relative z-10 px-6 py-16 md:py-20 md:px-10 lg:px-20 flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              AI-Powered Protection for Your Digital Life
            </h1>
            <p className="text-lg opacity-90 mb-6">
              CyberGuard AI uses advanced artificial intelligence to protect you from cyber threats, 
              malware, phishing, and identity theft.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-cyberguard-primary hover:bg-white/90" onClick={onScan}>
                <ShieldCheck className="mr-2 w-5 h-5" />
                Scan Now
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" onClick={onExploreFeatures}>
                Explore Features
              </Button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="relative">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/30 flex items-center justify-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center">
                    <Shield className="w-12 h-12 md:w-16 md:h-16 text-cyberguard-primary" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full animate-pulse-ring opacity-20 border-4 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
