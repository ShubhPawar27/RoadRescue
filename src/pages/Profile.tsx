
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { User, UserSettings } from "@/components/UserSettings";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("details");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarFallback className="text-3xl">{user ? getInitials(user.name) : "U"}</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold">{user?.name}</h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Personal Details</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Manage your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <User />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <UserSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
