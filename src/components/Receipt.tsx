import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Receipt as ReceiptIcon, Car, Clock, DollarSign, Check } from "lucide-react";

interface ReceiptData {
  plateNumber: string;
  entryTime: string;
  exitTime: string;
  payment: number;
  duration: string;
  receiptId: string;
}

interface ReceiptProps {
  data: ReceiptData;
  onClose: () => void;
}

export const Receipt = ({ data, onClose }: ReceiptProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <Card className="shadow-elegant bg-gradient-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center mb-2">
            <Check className="w-8 h-8 text-success-foreground" />
          </div>
          <CardTitle className="text-2xl text-success">Payment Successful</CardTitle>
          <p className="text-muted-foreground">Thank you for using our parking system</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Receipt Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <ReceiptIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">PARKING RECEIPT</h3>
            </div>
            <p className="text-sm text-muted-foreground">Receipt ID: {data.receiptId}</p>
            <p className="text-sm text-muted-foreground">
              Issued: {new Date(data.exitTime).toLocaleString()}
            </p>
          </div>

          <Separator />

          {/* Vehicle Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">License Plate:</span>
              </div>
              <span className="font-bold text-lg">{data.plateNumber}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Entry Time:</span>
              </div>
              <span>{new Date(data.entryTime).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Exit Time:</span>
              </div>
              <span>{new Date(data.exitTime).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Duration:</span>
              <span className="font-semibold">{data.duration}</span>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Rate:</span>
              <span>$0.50 per 30 minutes</span>
            </div>

            <div className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-success" />
                <span className="font-bold">Total Amount:</span>
              </div>
              <span className="font-bold text-success text-xl">${data.payment}</span>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>Thank you for your payment!</p>
            <p>Please keep this receipt for your records.</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="w-full"
            >
              Print Receipt
            </Button>
            <Button 
              onClick={onClose}
              className="w-full bg-gradient-primary hover:shadow-elegant transition-all duration-300"
            >
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};