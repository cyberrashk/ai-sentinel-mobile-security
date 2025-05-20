
import React from 'react';
import { Shield } from 'lucide-react';

const SecurityHero: React.FC = () => {
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
        <div className="relative z-10 px-6 py-10 md:py-16 md:px-10 lg:px-20 flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Free VPN & Antivirus for Everyone
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Unlimited AI-powered protection with no restrictions. Stay safe online with our advanced security features.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/30 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center">
                    <Shield className="w-8 h-8 md:w-12 md:h-12 text-cyberguard-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityHero;
