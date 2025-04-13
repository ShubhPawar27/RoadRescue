
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

const EmergencyButton: React.FC = () => {
  const [isActivating, setIsActivating] = useState(false);
  const { currentLocation, getLocation, isLoading: locationLoading } = useLocation();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const handleEmergencyRequest = async () => {
    setIsActivating(true);
    
    // Get current location if not available
    if (!currentLocation) {
      await getLocation();
    }
    
    // Simulate processing
    setTimeout(() => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        addNotification(
          "Authentication Required",
          "Please log in to send an emergency request",
          "warning"
        );
        navigate("/login");
        setIsActivating(false);
        return;
      }
      
      // Navigate to emergency request with ambulance service type
      navigate("/request", { 
        state: { 
          serviceType: "ambulance", 
          isEmergency: true
        } 
      });
      
      addNotification(
        "Emergency Request Initiated",
        "Help is on the way. Your location has been shared with nearby service providers.",
        "emergency"
      );
      
      setIsActivating(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        size="lg"
        className={`group w-16 h-16 rounded-full shadow-lg ${
          isActivating 
            ? "animate-pulse bg-emergency hover:bg-emergency/90" 
            : "bg-emergency hover:bg-emergency/90"
        } transition-all duration-300 p-0`}
        onClick={handleEmergencyRequest}
        disabled={isActivating || locationLoading}
      >
        <div className="flex flex-col items-center justify-center">
          {isActivating ? (
            <Send className="h-6 w-6 animate-ping" />
          ) : (
            <AlertCircle className="h-8 w-8 group-hover:scale-110 transition-transform" />
          )}
          <span className="text-xs font-bold mt-1">SOS</span>
        </div>
      </Button>
    </div>
  );
};

export default EmergencyButton;
