
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationContext";

type ServiceType = "towing" | "fuel" | "tire" | "battery" | "lockout" | "ambulance" | "other";

type ServiceRequest = {
  id: string;
  userId: string;
  serviceType: ServiceType;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: "pending" | "accepted" | "inProgress" | "completed" | "cancelled";
  createdAt: Date;
  providerId?: string;
  estimatedArrival?: Date;
};

type ServiceRequestContextType = {
  requests: ServiceRequest[];
  activeRequest: ServiceRequest | null;
  createRequest: (serviceType: ServiceType, description: string, location: { latitude: number; longitude: number; address?: string }) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;
  acceptRequest: (requestId: string, providerId: string, estimatedMinutes: number) => Promise<void>;
  completeRequest: (requestId: string) => Promise<void>;
  isLoading: boolean;
};

const ServiceRequestContext = createContext<ServiceRequestContextType | undefined>(undefined);

export const ServiceRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [activeRequest, setActiveRequest] = useState<ServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved requests from localStorage
  useEffect(() => {
    const savedRequests = localStorage.getItem("roadrescue-requests");
    if (savedRequests) {
      const parsedRequests = JSON.parse(savedRequests).map((request: any) => ({
        ...request,
        createdAt: new Date(request.createdAt),
        estimatedArrival: request.estimatedArrival ? new Date(request.estimatedArrival) : undefined
      }));
      setRequests(parsedRequests);

      // Find active request for current user
      if (user) {
        const activeReq = parsedRequests.find(
          (req: ServiceRequest) => 
            (user.type === "user" && req.userId === user.id || 
             user.type === "provider" && req.providerId === user.id) && 
            ["pending", "accepted", "inProgress"].includes(req.status)
        );
        setActiveRequest(activeReq || null);
      }
    }
  }, [user]);

  // Save requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("roadrescue-requests", JSON.stringify(requests));
  }, [requests]);

  const createRequest = async (
    serviceType: ServiceType,
    description: string,
    location: { latitude: number; longitude: number; address?: string }
  ) => {
    if (!user) throw new Error("User must be logged in to create a request");
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRequest: ServiceRequest = {
      id: `request-${Date.now()}`,
      userId: user.id,
      serviceType,
      description,
      location,
      status: "pending",
      createdAt: new Date()
    };
    
    setRequests(prev => [newRequest, ...prev]);
    setActiveRequest(newRequest);
    
    addNotification(
      "Service Request Created",
      `Your ${serviceType} request has been submitted and providers are being notified.`,
      "success"
    );
    
    setIsLoading(false);
    
    // Simulate provider accepting the request after a delay (for demo purposes)
    if (process.env.NODE_ENV !== "production") {
      setTimeout(() => {
        acceptRequest(newRequest.id, "provider-123", Math.floor(Math.random() * 15) + 5);
      }, 10000);
    }
  };

  const cancelRequest = async (requestId: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "cancelled" } 
          : req
      )
    );
    
    if (activeRequest?.id === requestId) {
      setActiveRequest(null);
    }
    
    addNotification(
      "Request Cancelled",
      "Your service request has been cancelled.",
      "info"
    );
    
    setIsLoading(false);
  };

  const acceptRequest = async (requestId: string, providerId: string, estimatedMinutes: number) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const estimatedArrival = new Date();
    estimatedArrival.setMinutes(estimatedArrival.getMinutes() + estimatedMinutes);
    
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: "accepted", 
              providerId, 
              estimatedArrival 
            } 
          : req
      )
    );
    
    const updatedRequest = requests.find(req => req.id === requestId);
    if (updatedRequest) {
      const updatedWithAccept = {
        ...updatedRequest,
        status: "accepted",
        providerId,
        estimatedArrival
      };
      setActiveRequest(updatedWithAccept);
      
      addNotification(
        "Request Accepted",
        `A service provider has accepted your request and will arrive in approximately ${estimatedMinutes} minutes.`,
        "success"
      );
    }
    
    setIsLoading(false);
    
    // Simulate starting service after a delay (for demo purposes)
    if (process.env.NODE_ENV !== "production") {
      setTimeout(() => {
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { ...req, status: "inProgress" } 
              : req
          )
        );
        
        const inProgressRequest = requests.find(req => req.id === requestId);
        if (inProgressRequest) {
          setActiveRequest({
            ...inProgressRequest,
            status: "inProgress"
          });
          
          addNotification(
            "Service In Progress",
            "The service provider has started working on your request.",
            "info"
          );
        }
      }, 15000);
    }
  };

  const completeRequest = async (requestId: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "completed" } 
          : req
      )
    );
    
    if (activeRequest?.id === requestId) {
      setActiveRequest(null);
    }
    
    addNotification(
      "Service Completed",
      "Your service request has been completed. Thank you for using RoadRescue Connect!",
      "success"
    );
    
    setIsLoading(false);
  };

  return (
    <ServiceRequestContext.Provider
      value={{
        requests,
        activeRequest,
        createRequest,
        cancelRequest,
        acceptRequest,
        completeRequest,
        isLoading
      }}
    >
      {children}
    </ServiceRequestContext.Provider>
  );
};

export const useServiceRequest = () => {
  const context = useContext(ServiceRequestContext);
  if (context === undefined) {
    throw new Error("useServiceRequest must be used within a ServiceRequestProvider");
  }
  return context;
};
