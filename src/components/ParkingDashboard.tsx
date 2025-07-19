import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Clock, DollarSign, LogOut, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParkingEntry {
  id: number;
  plateNumber: string;
  entryTime: string;
  exitTime: string | null;
  payment: number | null;
}

interface ParkingDashboardProps {
  refreshTrigger: number;
}

export const ParkingDashboard = ({ refreshTrigger }: ParkingDashboardProps) => {
  const [entries, setEntries] = useState<ParkingEntry[]>([]);
  const { toast } = useToast();

  const hourlyRate = 5; // $5 per hour

  useEffect(() => {
    loadEntries();
  }, [refreshTrigger]);

  const loadEntries = () => {
    const storedEntries = JSON.parse(localStorage.getItem("parkingEntries") || "[]");
    setEntries(storedEntries);
  };

  const calculatePayment = (entryTime: string, exitTime: string) => {
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const hours = Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60));
    return Math.max(hours * hourlyRate, hourlyRate); // Minimum 1 hour charge
  };

  const calculateCurrentDuration = (entryTime: string) => {
    const entry = new Date(entryTime);
    const now = new Date();
    const minutes = Math.floor((now.getTime() - entry.getTime()) / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const handleExit = (entryId: number, plateNumber: string) => {
    const exitTime = new Date().toISOString();
    const entry = entries.find(e => e.id === entryId);
    
    if (!entry) return;

    const payment = calculatePayment(entry.entryTime, exitTime);
    
    const updatedEntries = entries.map(entry => 
      entry.id === entryId 
        ? { ...entry, exitTime, payment }
        : entry
    );
    
    localStorage.setItem("parkingEntries", JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
    
    toast({
      title: "Exit Processed",
      description: `Vehicle ${plateNumber} has exited. Payment: $${payment}`,
    });
  };

  const currentlyParked = entries.filter(entry => !entry.exitTime);
  const totalRevenue = entries
    .filter(entry => entry.payment)
    .reduce((sum, entry) => sum + (entry.payment || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Currently Parked</p>
                <p className="text-3xl font-bold text-primary">{currentlyParked.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-success">${totalRevenue}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hourly Rate</p>
                <p className="text-3xl font-bold text-foreground">${hourlyRate}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Currently Parked Vehicles */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Currently Parked Vehicles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentlyParked.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No vehicles currently parked</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentlyParked.map((entry) => (
                <div 
                  key={entry.id} 
                  className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{entry.plateNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        Entered: {new Date(entry.entryTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-1">
                        {calculateCurrentDuration(entry.entryTime)}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Est. ${calculatePayment(entry.entryTime, new Date().toISOString())}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => handleExit(entry.id, entry.plateNumber)}
                      className="bg-gradient-primary hover:shadow-elegant transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Exit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Exits */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Exits</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.filter(entry => entry.exitTime).length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <p>No exit records yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries
                .filter(entry => entry.exitTime)
                .sort((a, b) => new Date(b.exitTime!).getTime() - new Date(a.exitTime!).getTime())
                .slice(0, 5)
                .map((entry) => (
                  <div 
                    key={entry.id} 
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">{entry.plateNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(entry.exitTime!).toLocaleString()}
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-success text-success-foreground">
                      ${entry.payment}
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};