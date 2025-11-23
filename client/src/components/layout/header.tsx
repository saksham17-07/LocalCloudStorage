import React from 'react';
import { Search, Plus, Bell, User, ChevronRight, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onUpload: () => void;
  onNewFolder: () => void;
  breadcrumbs: { id: string; name: string }[];
  onNavigate: (id: string | null) => void;
}

export function Header({ onUpload, onNewFolder, breadcrumbs, onNavigate }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-background px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-1 overflow-hidden">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap">
           <Button 
            variant="ghost" 
            size="sm" 
            className="h-auto p-1 font-normal hover:text-foreground"
            onClick={() => onNavigate(null)}
          >
            My Drive
          </Button>
          
          {breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-1 font-medium text-foreground hover:bg-transparent cursor-default"
              >
                {crumb.name}
              </Button>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search in Drive" 
            className="pl-9 bg-muted/40 border-none focus-visible:ring-1 focus-visible:bg-background transition-all" 
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pl-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 shadow-sm active-elevate">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onNewFolder} className="gap-2">
              <Folder className="h-4 w-4 mr-2 text-blue-500" /> New Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onUpload}>File Upload</DropdownMenuItem>
            <DropdownMenuItem onClick={onUpload}>Folder Upload</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>

        <Avatar className="h-8 w-8 border cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
