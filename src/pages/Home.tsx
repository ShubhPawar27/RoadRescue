
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Ambulance, Wrench, MapPin, PhoneCall, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEmergency, setIsEmergency] = useState(false);

  const handleEmergencyClick = () => {
    setIsEmergency(true);
    setTimeout(() => {
      if (isAuthenticated) {
        navigate("/services");
      } else {
        navigate("/login");
      }
    }, 500);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1562222979-97e0a33e9a33?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
              filter: "blur(2px)"
            }}
          ></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Emergency Roadside Assistance at Your Fingertips
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mb-10">
              Instant connection to nearby service providers for towing, repairs, and emergency medical assistance when you need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className={`${isEmergency ? 'animate-pulse-emergency bg-emergency' : 'bg-emergency'} hover:bg-emergency/90 text-white font-bold px-8 py-6 text-lg`}
                onClick={handleEmergencyClick}
              >
                <PhoneCall className="mr-2 h-5 w-5" /> Emergency Assistance
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900 font-bold px-8 py-6 text-lg"
                onClick={() => navigate("/services")}
              >
                <Car className="mr-2 h-5 w-5" /> View Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Emergency Services</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Get immediate assistance for all types of roadside emergencies with our network of trusted service providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Car className="h-12 w-12 mx-auto text-services mb-2" />
                <CardTitle>Towing Services</CardTitle>
                <CardDescription>Fast and reliable towing when your vehicle won't move</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our network of towing providers can quickly reach your location and transport your vehicle to a service center or your preferred destination.
                </p>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="outline" onClick={() => navigate("/services")}>Learn More</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Ambulance className="h-12 w-12 mx-auto text-emergency mb-2" />
                <CardTitle>Emergency Medical</CardTitle>
                <CardDescription>Rapid response medical assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  In case of accidents or medical emergencies, we connect you with the nearest ambulance services to provide immediate medical attention.
                </p>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="outline" onClick={() => navigate("/services")}>Learn More</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Wrench className="h-12 w-12 mx-auto text-rescue mb-2" />
                <CardTitle>Roadside Repairs</CardTitle>
                <CardDescription>On-the-spot solutions for common breakdowns</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  From flat tires to dead batteries and fuel delivery, our mobile mechanics can resolve many issues right where you are.
                </p>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="outline" onClick={() => navigate("/services")}>Learn More</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How RoadRescue Connect Works</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Our simple process ensures you get help quickly when you need it most
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-services text-white rounded-full mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Location</h3>
              <p className="text-gray-600">
                Use our app to automatically share your current location or manually enter your address.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-rescue text-white rounded-full mx-auto mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Select Service</h3>
              <p className="text-gray-600">
                Choose the type of assistance you need from our range of emergency services.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-emergency text-white rounded-full mx-auto mb-4">
                <PhoneCall className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Connected</h3>
              <p className="text-gray-600">
                We'll connect you with the nearest available service provider who will reach you quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Safety and Trust You Can Rely On</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Verified Providers</h3>
                    <p className="text-gray-600">All service providers undergo thorough background checks and verification</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Real-time Tracking</h3>
                    <p className="text-gray-600">Monitor the arrival of help in real-time on our secure platform</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Transparent Pricing</h3>
                    <p className="text-gray-600">Know the estimated cost before confirming any service</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">24/7 Support</h3>
                    <p className="text-gray-600">Our customer service team is available around the clock</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1632823471565-1c5ef2ad22e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80" 
                alt="Roadside assistance professional helping a customer" 
                className="rounded-lg shadow-lg object-cover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-services text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for Emergency Roadside Assistance?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of users who rely on RoadRescue Connect for immediate help when they need it most.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-services hover:bg-gray-100 font-bold px-8"
              onClick={() => navigate("/register")}
            >
              Sign Up Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-services font-bold px-8"
              onClick={() => navigate("/services")}
            >
              Explore Services
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
