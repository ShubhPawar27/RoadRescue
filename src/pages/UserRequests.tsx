
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Clock, MapPin, CarFront, CheckCircle, XCircle, AlertCircle, Ambulance } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useServiceRequest } from "@/contexts/ServiceRequestContext";

const serviceIcons: Record<string, React.ElementType> = {
  towing: CarFront,
  ambulance: Ambulance,
  default: AlertCircle
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  inProgress: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800"
};

const serviceTypeLabels: Record<string, string> = {
  towing: "Towing Service",
  fuel: "Fuel Delivery",
  tire: "Tire Change",
  battery: "Battery Jump Start",
  lockout: "Lockout Assistance",
  ambulance: "Emergency Medical",
  other: "Other Service"
};

const UserRequests = () => {
  const { user, isAuthenticated } = useAuth();
  const { requests, activeRequest } = useServiceRequest();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const userRequests = requests.filter(req => user && req.userId === user.id);
  const hasActiveRequest = activeRequest && user && activeRequest.userId === user.id;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Service Requests</h1>
              <p className="text-gray-600">View and manage your roadside assistance requests</p>
            </div>
            <Button onClick={() => navigate("/services")}>Request New Service</Button>
          </div>

          {hasActiveRequest && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Active Request</h2>
              <Card className="border-l-4 border-l-services">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{serviceTypeLabels[activeRequest.serviceType]}</CardTitle>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[activeRequest.status]}`}>
                      {activeRequest.status.charAt(0).toUpperCase() + activeRequest.status.slice(1)}
                    </span>
                  </div>
                  <CardDescription>
                    {new Date(activeRequest.createdAt).toLocaleDateString()} at {new Date(activeRequest.createdAt).toLocaleTimeString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {(() => {
                        const Icon = serviceIcons[activeRequest.serviceType] || serviceIcons.default;
                        return <Icon className="h-5 w-5 text-services mt-1" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 truncate">{activeRequest.description}</p>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500 truncate">
                          {activeRequest.location.address || `${activeRequest.location.latitude.toFixed(4)}, ${activeRequest.location.longitude.toFixed(4)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate("/user/active-request")}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">Request History</h2>
            {userRequests.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No request history</h3>
                <p className="mt-2 text-sm text-gray-500">You haven't made any service requests yet.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/services")}
                >
                  Request Service
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userRequests
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(request => {
                    const isActive = activeRequest && activeRequest.id === request.id;
                    if (isActive) return null; // Skip active request as it's shown above
                    
                    const StatusIcon = request.status === 'completed' ? CheckCircle : 
                                     request.status === 'cancelled' ? XCircle : Clock;
                    
                    return (
                      <Card key={request.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">{serviceTypeLabels[request.serviceType]}</CardTitle>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          <CardDescription>
                            {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              {(() => {
                                const Icon = serviceIcons[request.serviceType] || serviceIcons.default;
                                return <Icon className="h-5 w-5 text-gray-500 mt-1" />;
                              })()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-600 truncate">{request.description}</p>
                              <div className="flex items-center mt-1">
                                <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500 truncate">
                                  {request.location.address || `${request.location.latitude.toFixed(4)}, ${request.location.longitude.toFixed(4)}`}
                                </span>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <StatusIcon className={`h-5 w-5 
                                ${request.status === 'completed' ? 'text-green-500' : 
                                  request.status === 'cancelled' ? 'text-red-500' : 'text-blue-500'}`} 
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserRequests;
