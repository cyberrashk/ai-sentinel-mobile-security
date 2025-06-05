
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle } from 'lucide-react';
import * as darkWebService from '@/services/darkWebService';

interface DarkWebResultsProps {
  riskAnalysis: darkWebService.RiskAnalysis | null;
  breaches: darkWebService.LeakedCredential[];
  getSeverityColor: (severity: string) => string;
}

const DarkWebResults: React.FC<DarkWebResultsProps> = ({
  riskAnalysis,
  breaches,
  getSeverityColor
}) => {
  return (
    <div>
      {riskAnalysis && (
        <Alert className={`mb-4 ${getSeverityColor(riskAnalysis.overallRisk)}`}>
          <Shield className="w-4 h-4" />
          <AlertTitle>Overall Risk Assessment: {riskAnalysis.overallRisk.toUpperCase()}</AlertTitle>
          <AlertDescription>
            <div className="text-sm mt-2">
              <p className="mb-2">Risk Score: {riskAnalysis.riskScore}/100</p>
              <p className="mb-2">Recommended Actions:</p>
              <ul className="list-disc list-inside space-y-1">
                {riskAnalysis.actionableSteps.slice(0, 4).map((step: string, index: number) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {breaches.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Data Breaches Found ({breaches.length})</h4>
          {breaches.map((breach) => (
            <Alert key={breach.id} className="border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertTitle className="text-red-800">{breach.source}</AlertTitle>
              <AlertDescription>
                <div className="text-sm text-red-700">
                  <p>Date: {breach.dateLeaked.toLocaleDateString()}</p>
                  <p>Data exposed: {breach.dataExposed.join(', ')}</p>
                  <Badge className={getSeverityColor(breach.severity)} variant="outline">
                    {breach.severity.toUpperCase()} Risk
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default DarkWebResults;
