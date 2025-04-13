
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Wrench, Fuel, Battery, Key, Ambulance, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLocation } from "@/contexts/LocationContext";

const serviceTypes = [
  {
    id: "towing",
    title: "Towing Service",
    description: "Get your vehicle towed to a repair shop or desired location",
    icon: Car,
    color: "text-services",
    bgColor: "bg-services/10",
  },
  {
    id: "tire",
    title: "Tire Change",
    description: "Flat tire replacement with your spare or temporary tire",
    icon: Wrench,
    color: "text-rescue",
    bgColor: "bg-rescue/10",
  },
  {
    id: "fuel",
    title: "Fuel Delivery",
    description: "Emergency fuel delivery when you run out of gas",
    icon: Fuel,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "battery",
    title: "Battery Jump Start",
    description: "Jump start service for dead batteries",
    icon: Battery,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "lockout",
    title: "Lockout Assistance",
    description: "Help when you're locked out of your vehicle",
    icon: Key,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "ambulance",
    title: "Emergency Medical",
    description: "Medical assistance for accidents and emergencies",
    icon: Ambulance,
    color: "text-emergency",
    bgColor: "bg-emergency/10",
  },
  {
    id: "other",
    title: "Other Services",
    description: "Other roadside assistance not listed above",
    icon: AlertTriangle,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
];

const Services = () => {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const { currentLocation, error: locationError } = useLocation();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleServiceRequest = (serviceId: string) => {
    if (!isAuthenticated) {
      addNotification(
        "Authentication Required",
        "Please log in or register to request roadside assistance",
        "warning"
      );
      navigate("/login");
      return;
    }

    if (!currentLocation && !locationError) {
      addNotification(
        "Location Required",
        "Please enable location services to request assistance",
        "warning"
      );
      return;
    }

    setSelectedService(serviceId);
    navigate("/request", { state: { serviceType: serviceId } });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Roadside Assistance Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the service you need and we'll connect you with the nearest available provider
          </p>
        </div>

        {locationError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <div>
                <h3 className="font-medium">Location services disabled</h3>
                <p className="text-sm text-gray-600">
                  Enable location services for the best experience. You can still request services by providing your location manually.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceTypes.map((service) => (
            <Card key={service.id} className={`border-l-4 border-l-${service.color.replace('text-', '')} hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-full ${service.bgColor} flex items-center justify-center mb-4`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Professional assistance available 24/7 across the country. Our network of verified service providers ensures quick response times.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${service.id === 'ambulance' ? 'bg-emergency hover:bg-emergency/90' : ''}`}
                  onClick={() => handleServiceRequest(service.id)}
                >
                  Request Service
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Why Choose RoadRescue Connect?</h2>
            <p className="text-gray-600">
              We prioritize your safety and convenience with our comprehensive roadside assistance solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4 w-12 h-12 rounded-full bg-services/10">
                <AlertTriangle className="h-6 w-6 text-services" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Response Time</h3>
              <p className="text-gray-600">
                Our geolocation technology connects you with the nearest available service providers for quick assistance.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4 w-12 h-12 rounded-full bg-rescue/10">
                <Wrench className="h-6 w-6 text-rescue" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Professional Service</h3>
              <p className="text-gray-600">
                All service providers are thoroughly vetted and trained to deliver high-quality roadside assistance.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4 w-12 h-12 rounded-full bg-emergency/10">
                <Ambulance className="h-6 w-6 text-emergency" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Availability</h3>
              <p className="text-gray-600">
                Emergencies don't follow a schedule. Our services are available around the clock, every day of the year.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
