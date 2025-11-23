import React from 'react';
import { Search, Plus, Bell, User, ChevronRight, Folder, LayoutGrid, List, LogOut, UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onUpload: () => void;
  onNewFolder: () => void;
  breadcrumbs: { id: string; name: string }[];
  onNavigate: (id: string | null) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
  currentUser: { name: string; email: string };
}

export function Header({ 
  onUpload, 
  onNewFolder, 
  breadcrumbs, 
  onNavigate, 
  viewMode, 
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onLogout,
  currentUser
}: HeaderProps) {
  const user = currentUser || { name: "User", email: "user@example.com" };
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
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pl-4">
        <div className="flex items-center bg-muted/50 rounded-lg p-0.5 border">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-7 w-7 rounded-md ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-7 w-7 rounded-md ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
            onClick={() => onViewModeChange('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 border cursor-pointer ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 bg-muted/50">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <span className="truncate flex-1">{user.email}</span>
                <Check className="h-4 w-4 ml-auto" />
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" disabled>
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-3 w-3 text-muted-foreground" />
                </div>
                <span>Add another account</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
