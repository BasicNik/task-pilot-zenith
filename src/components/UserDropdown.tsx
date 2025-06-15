
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
import { 
  Settings, 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  Palette
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth, CustomUser } from '@/hooks/useAuth';

export const UserDropdown: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { customUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!customUser) {
    return null;
  }

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
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="aurora-outline"
          size="icon"
          className="aurora-glow h-10 w-10 p-0"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={customUser.avatar_url} alt={customUser.username} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(customUser.username)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 p-0" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        {/* User Profile Section */}
        <div className="p-4 bg-muted border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={customUser.avatar_url} alt={customUser.username} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                {getInitials(customUser.username)}
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
        </div>

        {/* Menu Items */}
        <div className="p-2 bg-popover">
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

          <DropdownMenuItem 
            className="cursor-pointer px-2 py-2 text-destructive focus:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
