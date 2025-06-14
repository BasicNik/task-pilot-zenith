import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  User, 
  Save,
  RotateCcw
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { customUser } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleResetTheme = () => {
    setTheme('light');
  };

  const colorPalette = [
    { name: 'Primary', color: 'var(--clr-primary-a0)', class: 'bg-primary-custom' },
    { name: 'Surface', color: 'var(--clr-surface-a0)', class: 'bg-surface-custom' },
    { name: 'Surface Tonal', color: 'var(--clr-surface-tonal-a0)', class: 'bg-surface-tonal-custom' },
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and customize your experience
        </p>
      </div>

      <div className="grid gap-6">
        {/* User Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your account details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Username</Label>
                <p className="text-sm text-muted-foreground mt-1">{customUser?.username || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground mt-1">{customUser?.email || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <Badge variant="outline" className="mt-1">
                  {customUser?.role || 'N/A'}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge 
                  variant={customUser?.is_active ? "default" : "destructive"} 
                  className="mt-1"
                >
                  {customUser?.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Theme</Label>
              <div className="flex gap-3">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light Mode
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark Mode
                </Button>
              </div>
            </div>

            <Separator />

            {/* Color Palette Preview */}
            {theme === 'dark' && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Dark Theme Color Palette</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {colorPalette.map((color) => (
                    <div key={color.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{color.name}</span>
                        <div 
                          className={`w-6 h-6 rounded border ${color.class}`}
                          style={{ backgroundColor: color.color }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {color.color}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetTheme}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Light Theme
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Control how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for task updates and reminders
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Email Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get email notifications for important updates
                </p>
              </div>
              <Switch
                checked={emailUpdates}
                onCheckedChange={setEmailUpdates}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Manage your privacy and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Auto-save</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save your work as you type
                </p>
              </div>
              <Switch
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}; 