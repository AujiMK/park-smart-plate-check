import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Car, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Receipt } from "./Receipt";

interface ParkingEntry {
  id: number;
  plateNumber: string;
  entryTime: string;
  exitTime: string | null;
  payment: number | null;
}

export const UserInterface = () => {
  const [plateNumber, setPlateNumber] = useState("");
  const [searchResult, setSearchResult] = useState<ParkingEntry | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const { toast } = useToast();

  const ratePerHalfHour = 0.50;

  const calculatePayment = (entryTime: string, exitTime: string) => {
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const minutes = Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60));
    const halfHourBlocks = Math.ceil(minutes / 30);
    return Math.max(halfHourBlocks * ratePerHalfHour, ratePerHalfHour);
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

  const handleSearch = () => {
    if (!plateNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid plate number",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      const entries = JSON.parse(localStorage.getItem("parkingEntries") || "[]");
      const found = entries.find(
        (entry: ParkingEntry) => 
          entry.plateNumber.toLowerCase() === plateNumber.toLowerCase() && !entry.exitTime
      );

      if (found) {
        setSearchResult(found);
        toast({
          title: "Vehicle Found",
          description: `Found parking record for ${plateNumber.toUpperCase()}`,
        });
      } else {
        setSearchResult(null);
        toast({
          title: "Not Found",
          description: "No active parking record found for this vehicle",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search records",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleExit = () => {
    if (!searchResult) return;

    const exitTime = new Date().toISOString();
    const payment = calculatePayment(searchResult.entryTime, exitTime);
    
    try {
      const entries = JSON.parse(localStorage.getItem("parkingEntries") || "[]");
      const updatedEntries = entries.map((entry: ParkingEntry) => 
        entry.id === searchResult.id 
          ? { ...entry, exitTime, payment }
          : entry
      );
      
      localStorage.setItem("parkingEntries", JSON.stringify(updatedEntries));
      
      // Prepare receipt data
      const receipt = {
        plateNumber: searchResult.plateNumber,
        entryTime: searchResult.entryTime,
        exitTime,
        payment,
        duration: calculateCurrentDuration(searchResult.entryTime),
        receiptId: `RCP-${Date.now()}`,
      };
      
      setReceiptData(receipt);
      setShowReceipt(true);
      setSearchResult(null);
      setPlateNumber("");
      
      toast({
        title: "Payment Processed",
        description: `Exit successful. Total fee: $${payment}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process exit",
        variant: "destructive",
      });
    }
  };

  if (showReceipt && receiptData) {
    return (
      <Receipt 
        data={receiptData} 
        onClose={() => {
          setShowReceipt(false);
          setReceiptData(null);
        }} 
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search Section */}
      <Card className="shadow-card bg-gradient-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-2">
            <Search className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Find Your Vehicle</CardTitle>
          <p className="text-muted-foreground">Enter your license plate to check parking status and pay</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchPlate">License Plate Number</Label>
              <div className="flex gap-2">
                <Input
                  id="searchPlate"
                  type="text"
                  placeholder="Enter plate number (e.g., ABC-123)"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="text-center font-mono text-lg"
                  disabled={isSearching}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-gradient-primary hover:shadow-elegant transition-all duration-300"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <DollarSign className="w-4 h-4" />
              <span>Rate: $0.50 per 30 minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Result */}
      {searchResult && (
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Vehicle Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">License Plate</Label>
                  <p className="text-2xl font-bold">{searchResult.plateNumber}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Parking Duration</Label>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {calculateCurrentDuration(searchResult.entryTime)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Entry Time</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(searchResult.entryTime).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Current Fee</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-success" />
                    <span className="text-xl font-bold text-success">
                      ${calculatePayment(searchResult.entryTime, new Date().toISOString())}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleExit}
                className="w-full bg-gradient-primary hover:shadow-elegant transition-all duration-300 text-lg py-6"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Pay & Exit - ${calculatePayment(searchResult.entryTime, new Date().toISOString())}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};