
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Phone, CheckCircle, XCircle, Car, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useServiceRequest } from "@/contexts/ServiceRequestContext";
import { useNotifications } from "@/contexts/NotificationContext";

const serviceTypeLabels: Record<string, string> = {
  towing: "Towing Service",
  fuel: "Fuel Delivery",
  tire: "Tire Change",
  battery: "Battery Jump Start",
  lockout: "Lockout Assistance",
  ambulance: "Emergency Medical",
  other: "Other Service"
};

const ProviderDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { requests, activeRequest, acceptRequest, completeRequest } = useServiceRequest();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  
  const [availableRequests, setAvailableRequests] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(15);
  const [isAccepting, setIsAccepting] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.type !== "provider") {
      navigate("/");
      return;
    }

    // Filter requests
    const available = requests.filter(req => req.status === 'pending');
    const myActiveReqs = requests.filter(req => 
      req.providerId === user.id && 
      ['accepted', 'inProgress'].includes(req.status)
    );
    
    setAvailableRequests(available);
    setMyRequests(myActiveReqs);
  }, [isAuthenticated, user, requests, navigate]);

  const handleAcceptRequest = (request: any) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const confirmAcceptRequest = async () => {
    if (!selectedRequest || !user) return;
    
    setIsAccepting(true);
    
    try {
      await acceptRequest(selectedRequest.id, user.id, estimatedMinutes);
      addNotification(
        "Request Accepted",
        `You've accepted the ${serviceTypeLabels[selectedRequest.serviceType]} request.`,
        "success"
      );
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to accept request:", error);
      addNotification(
        "Action Failed",
        "Failed to accept the request. Please try again.",
        "error"
      );
    } finally {
      setIsAccepting(false);
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    try {
      await completeRequest(requestId);
      addNotification(
        "Request Completed",
        "You've successfully completed the service request.",
        "success"
      );
    } catch (error) {
      console.error("Failed to complete request:", error);
      addNotification(
        "Action Failed",
        "Failed to complete the request. Please try again.",
        "error"
      );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Provider Dashboard</h1>
              <p className="text-gray-600">Manage service requests and your availability</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                className="w-full md:w-auto"
                variant="outline"
              >
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </div>
          </div>

          {/* Active Jobs Section */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">My Active Jobs</h2>
            {myRequests.length === 0 ? (
              <Card className="bg-gray-50">
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">You don't have any active jobs at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myRequests.map((request) => (
                  <Card key={request.id} className="border-l-4 border-l-services">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{serviceTypeLabels[request.serviceType]}</CardTitle>
                          <CardDescription>
                            Request ID: {request.id.substring(0, 8)}...
                          </CardDescription>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {request.status === "accepted" ? "Accepted" : "In Progress"}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-sm text-gray-600">
                            {request.location.address || `Coordinates: ${request.location.latitude.toFixed(6)}, ${request.location.longitude.toFixed(6)}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Estimated Arrival</p>
                          <p className="text-sm text-gray-600">
                            {request.estimatedArrival 
                              ? new Date(request.estimatedArrival).toLocaleTimeString() 
                              : "Not set"
                            }
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium">Description</p>
                        <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      </div>

                      {request.status === "accepted" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>En Route</span>
                            <span>Arrived</span>
                          </div>
                          <Progress value={50} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:+1234567890`}>
                          <Phone className="mr-2 h-4 w-4" /> Call Customer
                        </a>
                      </Button>
                      {request.status === "accepted" ? (
                        <Button size="sm" variant="default">
                          Start Service
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleCompleteRequest(request.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Complete
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Available Requests Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Service Requests</h2>
            {availableRequests.length === 0 ? (
              <Card className="bg-gray-50">
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">There are no available service requests at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{serviceTypeLabels[request.serviceType]}</CardTitle>
                      <CardDescription>
                        {new Date(request.createdAt).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600">
                            {request.location.address || `Coordinates: ${request.location.latitude.toFixed(6)}, ${request.location.longitude.toFixed(6)}`}
                          </p>
                        </div>
                        <div className="flex items-start">
                          <Car className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => handleAcceptRequest(request)}
                      >
                        Accept Request
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accept Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Service Request</DialogTitle>
            <DialogDescription>
              You are about to accept a {selectedRequest && serviceTypeLabels[selectedRequest.serviceType]} request. 
              Please provide your estimated arrival time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="estimated-time">Estimated arrival time (minutes)</Label>
              <Input 
                id="estimated-time" 
                type="number" 
                min="1" 
                max="60" 
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
              />
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">
                Once you accept this request, the customer will be notified and will expect 
                you to arrive within the estimated time.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={confirmAcceptRequest} 
              disabled={isAccepting}
            >
              {isAccepting ? "Accepting..." : "Accept Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ProviderDashboard;
