import { useState } from "react";
import { ParkingEntry } from "@/components/ParkingEntry";
import { ParkingDashboard } from "@/components/ParkingDashboard";
import { Car, Gauge } from "lucide-react";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEntryAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Smart Parking System</h1>
              <p className="text-white/80">Efficient vehicle management solution</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Entry Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ParkingEntry onEntryAdded={handleEntryAdded} />
            </div>
          </div>
          
          {/* Dashboard Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Gauge className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">Parking Dashboard</h2>
            </div>
            <ParkingDashboard refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
