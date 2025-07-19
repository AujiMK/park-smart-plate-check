import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Car, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParkingEntryProps {
  onEntryAdded: () => void;
}

export const ParkingEntry = ({ onEntryAdded }: ParkingEntryProps) => {
  const [plateNumber, setPlateNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plateNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid plate number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const existingEntries = JSON.parse(localStorage.getItem("parkingEntries") || "[]");
      
      // Check if vehicle is already parked
      const alreadyParked = existingEntries.find(
        (entry: any) => entry.plateNumber.toLowerCase() === plateNumber.toLowerCase() && !entry.exitTime
      );

      if (alreadyParked) {
        toast({
          title: "Vehicle Already Parked",
          description: `Vehicle ${plateNumber} is already in the parking area`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const newEntry = {
        id: Date.now(),
        plateNumber: plateNumber.toUpperCase(),
        entryTime: new Date().toISOString(),
        exitTime: null,
        payment: null,
      };

      const updatedEntries = [...existingEntries, newEntry];
      localStorage.setItem("parkingEntries", JSON.stringify(updatedEntries));

      toast({
        title: "Entry Successful",
        description: `Vehicle ${plateNumber.toUpperCase()} has been logged for parking`,
      });

      setPlateNumber("");
      onEntryAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-card bg-gradient-card">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-2">
          <Car className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl">Vehicle Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plateNumber">License Plate Number</Label>
            <Input
              id="plateNumber"
              type="text"
              placeholder="Enter plate number (e.g., ABC-123)"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="text-center font-mono text-lg"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Entry Time: {new Date().toLocaleString()}</span>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:shadow-elegant transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Logging Entry..." : "Log Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};