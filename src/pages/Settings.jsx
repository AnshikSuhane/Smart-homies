import { Bell, Moon, Shield, Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useThemeContext } from '@/Theme/Theme';

const Settings = () => {
  const { mode, toggleColorMode } = useThemeContext()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6 md:p-8">
      <div className="container max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-8 h-8" />
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        </div>
        
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize how the application looks and feels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
              <div className="space-y-1">
                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
              </div>
              <Switch 
                checked={mode === "dark"}
                onCheckedChange={toggleColorMode}
                id="dark-mode"
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
              <div className="space-y-1">
                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications even when you're not using the app</p>
              </div>
              <Switch defaultChecked id="push-notifications" className="data-[state=checked]:bg-primary" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
              <div className="space-y-1">
                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Get important updates via email</p>
              </div>
              <Switch defaultChecked id="email-notifications" className="data-[state=checked]:bg-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Privacy</CardTitle>
            </div>
            <CardDescription>Manage your privacy settings and data usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
              <div className="space-y-1">
                <Label htmlFor="usage-data" className="text-base">Share Usage Data</Label>
                <p className="text-sm text-muted-foreground">Help us improve by sharing anonymous usage data</p>
              </div>
              <Switch defaultChecked id="usage-data" className="data-[state=checked]:bg-primary" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
              <div className="space-y-1">
                <Label htmlFor="location-services" className="text-base">Location Services</Label>
                <p className="text-sm text-muted-foreground">Allow access to your location for relevant features</p>
              </div>
              <Switch id="location-services" className="data-[state=checked]:bg-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;