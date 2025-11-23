import React from 'react';
import { HardDrive, Clock, Star, Trash2, Cloud, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  storageUsed: number; // in MB
  storageLimit: number; // in MB
}

export function Sidebar({ activeTab, onTabChange, onSettingsClick, onLogoutClick, storageUsed, storageLimit }: SidebarProps) {
  const navItems = [
    { id: 'my-drive', label: 'My Drive', icon: HardDrive },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  // Convert MB to GB for display if > 1024
  const usedDisplay = storageUsed > 1024 
    ? `${(storageUsed / 1024).toFixed(1)} GB` 
    : `${Math.ceil(storageUsed)} MB`;
    
  const limitDisplay = storageLimit > 1024 
    ? `${(storageLimit / 1024).toFixed(0)} GB` 
    : `${storageLimit} MB`;

  const percentage = Math.min((storageUsed / storageLimit) * 100, 100);

  return (
    <aside className="w-64 border-r bg-sidebar flex flex-col h-full">
      <div className="p-6 flex items-center gap-2 text-primary">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <Cloud className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-xl tracking-tight text-sidebar-foreground">MiniCloud</span>
      </div>

      <div className="px-3 py-2 flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10 font-medium",
                  isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="mt-8 px-3">
          <div className="flex items-center justify-between text-xs font-medium mb-2 text-muted-foreground">
            <span>Storage</span>
            <span>{usedDisplay} / {limitDisplay}</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </div>

      <div className="p-4 border-t space-y-1">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={onSettingsClick}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={onLogoutClick}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
