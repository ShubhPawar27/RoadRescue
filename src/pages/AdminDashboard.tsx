
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useServiceRequest } from "@/contexts/ServiceRequestContext";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  Users, 
  Wrench, 
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { requests } = useServiceRequest();
  const navigate = useNavigate();
  const [usersCount, setUsersCount] = useState(0);
  const [providersCount, setProvidersCount] = useState(0);

  useEffect(() => {
    // Redirect if not admin
    if (!isAuthenticated || (user && user.type !== "admin")) {
      navigate("/login");
    }
    
    // In a real app, these would come from an API
    setUsersCount(25);
    setProvidersCount(8);
  }, [isAuthenticated, user, navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Accepted</Badge>;
      case "inProgress":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="flex h-full">
        <AdminSidebar />
        <div className="flex-1 p-6 overflow-auto">
          <AdminHeader title="Admin Dashboard" subtitle="Manage your application" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requests.length}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime service requests
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {requests.filter(r => ["pending", "accepted", "inProgress"].includes(r.status)).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently active requests
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usersCount}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{providersCount}</div>
                <p className="text-xs text-muted-foreground">
                  Active service providers
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Recent Service Requests</h2>
            </div>
            <Table>
              <TableCaption>A list of recent service requests.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.slice(0, 10).map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id.substring(0, 8)}...</TableCell>
                    <TableCell className="capitalize">{request.serviceType}</TableCell>
                    <TableCell>{request.userId.substring(0, 8)}...</TableCell>
                    <TableCell>{request.providerId ? `${request.providerId.substring(0, 8)}...` : "—"}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
