import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">RoadRescue Connect</h3>
            <p className="text-gray-300 text-sm">
              Providing rapid roadside assistance when you need it most. Our network of service providers ensures you're never stranded for long.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/shubhpawar_27?igsh=MWhvM2dhNzlldTN3cw==" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://github.com/ShubhPawar27" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/services" className="hover:text-white">Towing Services</Link></li>
              <li><Link to="/services" className="hover:text-white">Fuel Delivery</Link></li>
              <li><Link to="/services" className="hover:text-white">Tire Change</Link></li>
              <li><Link to="/services" className="hover:text-white">Battery Jump Start</Link></li>
              <li><Link to="/services" className="hover:text-white">Lockout Assistance</Link></li>
              <li><Link to="/services" className="hover:text-white">Emergency Medical</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/help" className="hover:text-white">Help & Support</Link></li>
              <li><Link to="/partners" className="hover:text-white">Partner With Us</Link></li>
              <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              <li><Link to="/licenses" className="hover:text-white">Licenses</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8">
          <p className="text-center text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} RoadRescue Connect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
