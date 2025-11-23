import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Monitor, Database, Shield, Bell } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { setTheme, theme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Appearance Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2 text-primary">
              <Monitor className="h-4 w-4" /> Appearance
            </h4>
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Dark Mode</span>
                <span className="text-xs text-muted-foreground">Switch between light and dark themes</span>
              </div>
              <div className="flex items-center gap-2 border rounded-full p-1 bg-background">
                <Button 
                  variant={theme === 'light' ? "secondary" : "ghost"} 
                  size="icon" 
                  className="h-7 w-7 rounded-full"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button 
                  variant={theme === 'dark' ? "secondary" : "ghost"} 
                  size="icon" 
                  className="h-7 w-7 rounded-full"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Storage Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2 text-primary">
              <Database className="h-4 w-4" /> Storage & Sync
            </h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="sync" className="flex flex-col gap-1">
                <span>Offline Access</span>
                <span className="font-normal text-xs text-muted-foreground">Available for recent files</span>
              </Label>
              <Switch id="sync" defaultChecked />
            </div>
          </div>

          <Separator />

          {/* Privacy Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2 text-primary">
              <Shield className="h-4 w-4" /> Privacy
            </h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="activity" className="flex flex-col gap-1">
                <span>Activity Status</span>
                <span className="font-normal text-xs text-muted-foreground">Show when you were last active</span>
              </Label>
              <Switch id="activity" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
