
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Image, AlertTriangle } from 'lucide-react';

interface DetectedImage {
  id: string;
  type: string;
  source: string;
  risk: string;
  description: string;
}

interface DarkWebImageDetectionProps {
  detectedImages: DetectedImage[];
  getSeverityColor: (severity: string) => string;
}

const DarkWebImageDetection: React.FC<DarkWebImageDetectionProps> = ({
  detectedImages,
  getSeverityColor
}) => {
  return (
    <div className="space-y-4">
      <Alert className="border-orange-200 bg-orange-50">
        <Image className="w-4 h-4" />
        <AlertTitle>Image Detection on Dark Web</AlertTitle>
        <AlertDescription>
          Advanced AI scans for your images across dark web marketplaces and forums
        </AlertDescription>
      </Alert>
      
      {detectedImages.map((image) => (
        <Alert key={image.id} className={getSeverityColor(image.risk)}>
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>{image.type.charAt(0).toUpperCase() + image.type.slice(1)} Image Detected</AlertTitle>
          <AlertDescription>
            <p className="mb-2">{image.description}</p>
            <p className="text-sm">Source: {image.source}</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline">View Details</Button>
              <Button size="sm" className="bg-red-600 text-white">Request Removal</Button>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default DarkWebImageDetection;
