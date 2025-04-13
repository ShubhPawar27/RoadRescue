
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Phone, Car, X, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useServiceRequest } from "@/contexts/ServiceRequestContext";

const serviceTypeLabels: Record<string, string> = {
  towing: "Towing Service",
  fuel: "Fuel Delivery",
  tire: "Tire Change",
  battery: "Battery Jump Start",
  lockout: "Lockout Assistance",
  ambulance: "Emergency Medical",
  other: "Other Service"
};

const statusLabels: Record<string, string> = {
  pending: "Looking for Service Providers",
  accepted: "Service Provider Assigned",
  inProgress: "Service In Progress",
  completed: "Service Completed",
  cancelled: "Service Cancelled"
};

const ActiveRequest = () => {
  const { user, isAuthenticated } = useAuth();
  const { activeRequest, cancelRequest, completeRequest } = useServiceRequest();
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!activeRequest) {
      navigate("/user/requests");
      return;
    }

    // Calculate time remaining if estimated arrival time exists
    if (activeRequest.estimatedArrival) {
      const calculateTimeRemaining = () => {
        const now = new Date();
        const arrival = new Date(activeRequest.estimatedArrival!);
        const diffMs = arrival.getTime() - now.getTime();
        
        if (diffMs <= 0) {
          return "Arriving now";
        }
        
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMins / 60);
        const remainingMins = diffMins % 60;
        
        if (diffHrs > 0) {
          return `${diffHrs} hr ${remainingMins} min`;
        } else {
          return `${remainingMins} min`;
        }
      };
      
      // Calculate progress percentage (time elapsed / total time)
      const calculateProgress = () => {
        const now = new Date();
        const arrival = new Date(activeRequest.estimatedArrival!);
        const accepted = new Date(activeRequest.createdAt);
        
        const totalTime = arrival.getTime() - accepted.getTime();
        const elapsedTime = now.getTime() - accepted.getTime();
        
        const progress = Math.min(Math.max((elapsedTime / totalTime) * 100, 0), 100);
        return Math.round(progress);
      };
      
      const updateTimer = () => {
        setTimeRemaining(calculateTimeRemaining());
        if (activeRequest.status === "accepted") {
          setProgressValue(calculateProgress());
        } else if (activeRequest.status === "inProgress") {
          setProgressValue(100);
        }
      };
      
      updateTimer();
      const timer = setInterval(updateTimer, 60000);
      return () => clearInterval(timer);
    }
  }, [isAuthenticated, activeRequest, navigate]);

  const handleCancelRequest = async () => {
    if (!activeRequest) return;
    
    await cancelRequest(activeRequest.id);
    navigate("/user/requests");
  };

  // For demo purposes, providers would typically mark the request as completed
  const handleCompleteRequest = async () => {
    if (!activeRequest) return;
    
    await completeRequest(activeRequest.id);
    navigate("/user/requests");
  };

  if (!activeRequest) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p>No active request found.</p>
            <Button 
              className="mt-4"
              onClick={() => navigate("/services")}
            >
              Request Service
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-t-4 border-t-services">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {serviceTypeLabels[activeRequest.serviceType] || "Service"} Request
                  </CardTitle>
                  <CardDescription>
                    Request ID: {activeRequest.id.substring(0, 10)}...
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
                    ${activeRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      activeRequest.status === 'accepted' ? 'bg-blue-100 text-blue-800' : 
                      activeRequest.status === 'inProgress' ? 'bg-green-100 text-green-800' : 
                      activeRequest.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                      'bg-red-100 text-red-800'}`}
                  >
                    {statusLabels[activeRequest.status]}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activeRequest.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Status progress indicator */}
                {activeRequest.status !== 'cancelled' && activeRequest.status !== 'completed' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Request Created</span>
                      {activeRequest.status === 'pending' ? (
                        <span className="text-yellow-600 animate-pulse flex items-center">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Finding provider...
                        </span>
                      ) : activeRequest.status === 'accepted' ? (
                        <span className="text-blue-600">Provider assigned</span>
                      ) : activeRequest.status === 'inProgress' ? (
                        <span className="text-green-600">Service in progress</span>
                      ) : (
                        <span>Complete</span>
                      )}
                    </div>
                    <Progress value={progressValue} className="h-2" />
                  </div>
                )}

                {/* Service details */}
                <div className="bg-gray-50 p-4 rounded-md space-y-3">
                  <div className="flex items-start">
                    <Car className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Service Type</p>
                      <p className="text-gray-600">{serviceTypeLabels[activeRequest.serviceType] || activeRequest.serviceType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">
                        {activeRequest.location.address ? (
                          activeRequest.location.address
                        ) : (
                          `Coordinates: ${activeRequest.location.latitude.toFixed(6)}, ${activeRequest.location.longitude.toFixed(6)}`
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Estimated Arrival</p>
                      {activeRequest.status === 'pending' ? (
                        <p className="text-yellow-600">Waiting for service provider...</p>
                      ) : activeRequest.estimatedArrival ? (
                        <div>
                          <p className="text-gray-600">
                            {new Date(activeRequest.estimatedArrival).toLocaleTimeString()} ({timeRemaining} remaining)
                          </p>
                        </div>
                      ) : activeRequest.status === 'cancelled' ? (
                        <p className="text-red-600">Request cancelled</p>
                      ) : activeRequest.status === 'completed' ? (
                        <p className="text-green-600">Service completed</p>
                      ) : (
                        <p className="text-gray-600">Not available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Provider details (if assigned) */}
                {activeRequest.providerId && (activeRequest.status === 'accepted' || activeRequest.status === 'inProgress') && (
                  <div className="border border-gray-200 p-4 rounded-md">
                    <h3 className="font-medium text-lg mb-3">Service Provider</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-gray-500 font-bold">SP</span>
                        </div>
                        <div>
                          <p className="font-medium">Service Provider</p>
                          <p className="text-sm text-gray-500">Professional Assistance</p>
                        </div>
                      </div>
                      <Button variant="outline" size="icon" asChild>
                        <a href="tel:+1234567890">
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="font-medium mb-2">Problem Description</h3>
                  <p className="text-gray-600">{activeRequest.description}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              {activeRequest.status === 'pending' || activeRequest.status === 'accepted' ? (
                <Button 
                  variant="outline" 
                  className="w-full border-red-500 text-red-500 hover:bg-red-50"
                  onClick={handleCancelRequest}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Request
                </Button>
              ) : activeRequest.status === 'inProgress' ? (
                // For demo purposes - normally the service provider would mark as complete
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleCompleteRequest}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              ) : null}
              
              <Button
                variant={activeRequest.status === 'completed' || activeRequest.status === 'cancelled' ? "default" : "outline"}
                className="w-full"
                onClick={() => navigate("/user/requests")}
              >
                View All Requests
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ActiveRequest;
