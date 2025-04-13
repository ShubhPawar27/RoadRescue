
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCog, UserRound, Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Personal details form schema
const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number must be at least 6 characters"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// Settings form schema
const userSettingsSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserSettingsValues = z.infer<typeof userSettingsSchema>;

export const User = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = (data: UserFormValues) => {
    // In a real application, this would update the user in the database
    console.log("Updated user data:", data);
    addNotification(
      "Profile Updated",
      "Your profile has been updated successfully",
      "success"
    );
    setIsEditing(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium">Personal Information</h3>
          </div>
          {!isEditing ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    readOnly={!isEditing} 
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email" 
                    readOnly={!isEditing} 
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    readOnly={!isEditing} 
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export const UserSettings = () => {
  const { addNotification } = useNotifications();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<UserSettingsValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: UserSettingsValues) => {
    // In a real application, this would update the user's password
    console.log("Password change request:", data);
    addNotification(
      "Password Updated",
      "Your password has been updated successfully",
      "success"
    );
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <UserCog className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Change Password</h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      {...field} 
                      type={showCurrentPassword ? "text" : "password"} 
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      {...field} 
                      type={showNewPassword ? "text" : "password"} 
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      {...field} 
                      type={showConfirmPassword ? "text" : "password"} 
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">Change Password</Button>
      </form>
    </Form>
  );
};
