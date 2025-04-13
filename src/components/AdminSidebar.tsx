
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Package, 
  MessageSquare, 
  Bell, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <div className="hidden md:flex flex-col h-full w-64 bg-gray-50 border-r p-4">
      <div className="py-2 mb-6">
        <h2 className="text-xl font-bold text-center">Admin Panel</h2>
      </div>
      
      <nav className="space-y-1 flex-1">
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/admin/dashboard")}>
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/admin/users")}>
          <Users className="h-4 w-4" />
          Users
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/admin/services")}>
          <Package className="h-4 w-4" />
          Services
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/admin/notifications")}>
          <Bell className="h-4 w-4" />
          Notifications
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/admin/settings")}>
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </nav>
      
      <div className="mt-auto pt-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-2 text-red-500" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
