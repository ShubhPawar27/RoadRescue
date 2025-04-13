
import { useState } from "react";
import { ChevronDown, Mail, MessageSquare, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Layout from "@/components/Layout";
import { useNotifications } from "@/contexts/NotificationContext";

const faqs = [
  {
    question: "How do I request roadside assistance?",
    answer: "You can request roadside assistance through our app or website. Simply log in, click on 'Request Service', choose the type of assistance you need, and provide your location. We'll connect you with the nearest available service provider."
  },
  {
    question: "What types of services do you offer?",
    answer: "We offer a range of roadside assistance services including towing, jump starts, tire changes, fuel delivery, lockout assistance, and emergency medical services. You can view all available services in the Services section of our app or website."
  },
  {
    question: "How quickly will help arrive?",
    answer: "Response times vary based on your location, traffic conditions, and provider availability. In urban areas, assistance typically arrives within 15-45 minutes. In rural areas, it may take longer. Once a provider accepts your request, you'll receive an estimated arrival time."
  },
  {
    question: "What should I do while waiting for assistance?",
    answer: "Ensure your safety first. If possible, move your vehicle to a safe location away from traffic. Turn on your hazard lights, and remain in your vehicle with doors locked if it's safe to do so. You can track your service provider's arrival through our app."
  },
  {
    question: "How do I become a service provider?",
    answer: "To join our network of service providers, click on 'Register as Provider' and complete the application process. You'll need to provide details about your business, services offered, and coverage area. Our team will review your application and contact you with next steps."
  },
  {
    question: "Can I cancel a service request?",
    answer: "Yes, you can cancel a service request if a provider hasn't been assigned yet. If a provider has already accepted your request, you may still cancel but please note this may affect your account standing."
  },
  {
    question: "Is my personal information secure?",
    answer: "We take data security very seriously. All personal information is encrypted and stored securely. We do not share your details with third parties except for the service provider who accepts your request. Please review our Privacy Policy for more information."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards, as well as digital payment services like PayPal and Apple Pay. Payment information is securely processed and stored according to industry standards."
  },
];

const Help = () => {
  const { addNotification } = useNotifications();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending the message
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addNotification(
      "Message Sent",
      "Thank you for your message. Our support team will get back to you soon.",
      "success"
    );
    
    // Reset form
    setName("");
    setEmail("");
    setMessage("");
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions or contact our support team
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-services/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneCall className="h-6 w-6 text-services" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Emergency Support</h3>
              <p className="text-gray-600 mb-4">
                24/7 phone support for urgent assistance
              </p>
              <a 
                href="tel:+18001234567" 
                className="text-services font-semibold hover:underline"
              >
                +1 800 123 4567
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-rescue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-rescue" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">
                General inquiries and non-urgent issues
              </p>
              <a 
                href="mailto:support@roadrescue.com" 
                className="text-rescue font-semibold hover:underline"
              >
                support@roadrescue.com
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emergency/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-emergency" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">
                Chat with our support team in real-time
              </p>
              <button 
                className="text-emergency font-semibold hover:underline"
                onClick={() => addNotification("Live Chat", "This feature is coming soon!", "info")}
              >
                Start Chat
              </button>
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="bg-white rounded-lg shadow">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?" 
                    rows={5}
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Message..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
