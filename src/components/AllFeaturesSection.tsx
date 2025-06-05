
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeatureGrid from '@/components/FeatureGrid';

const AllFeaturesSection: React.FC = () => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">All Security Features</h2>
        <Button variant="outline">
          View All
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Features</TabsTrigger>
          <TabsTrigger value="protection">Protection</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <FeatureGrid />
        </TabsContent>
        
        <TabsContent value="protection" className="mt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Protection features will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="privacy" className="mt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Privacy features will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="identity" className="mt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Identity protection features will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AllFeaturesSection;
