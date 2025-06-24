import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Settings, Moon, Sun, LogOut, User, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth, CustomUser } from '@/hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const UserDropdown: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { customUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isImgBroken, setIsImgBroken] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  if (!customUser) {
    return null;
  }

  // Check for avatar URL and use fallback if not present
  const avatarUrl =
    customUser.avatar_url && customUser.avatar_url.trim() !== ""
      ? customUser.avatar_url
      : undefined; // instead of /placeholder.svg, use undefined for truly blank

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      setShowLogoutDialog(false);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 rounded-full">
            <Avatar className="h-8 w-8 border-2 border-primary/20">
              {avatarUrl && !isImgBroken && (
                <AvatarImage
                  src={avatarUrl}
                  alt={customUser.username || "User"}
                  onError={() => setIsImgBroken(true)}
                />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                {getInitials(customUser.username || "U")}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-semibold truncate max-w-[120px]">{customUser.username}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-0 glass-dropdown-profile" align="end" forceMount sideOffset={8}>
          {/* User Profile Section */}
          <div className="p-4 border-b flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              {avatarUrl && !isImgBroken && (
                <AvatarImage
                  src={avatarUrl}
                  alt={customUser.username || "User"}
                  onError={() => setIsImgBroken(true)}
                />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                {getInitials(customUser.username || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold text-foreground truncate">
                  {customUser.username}
                </p>
                {customUser.is_verified && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {customUser.email}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant={customUser.is_active ? "default" : "destructive"}
                  className="text-xs px-1.5 py-0.5"
                >
                  {customUser.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  {customUser.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              Account
            </DropdownMenuLabel>
            
            <DropdownMenuItem className="cursor-pointer px-2 py-2">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer px-2 py-2">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              Appearance
            </DropdownMenuLabel>

            <DropdownMenuItem 
              className="cursor-pointer px-2 py-2"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer px-2 py-2">
              <Palette className="mr-2 h-4 w-4" />
              <span>Customize Theme</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer px-2 py-2 text-destructive focus:text-destructive"
              onClick={() => {
                setIsOpen(false);
                setShowLogoutDialog(true);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Logout AlertDialog outside dropdown */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will log you out of your account. You can log in again anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
