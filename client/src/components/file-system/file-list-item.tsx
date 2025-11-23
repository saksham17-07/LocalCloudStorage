import { FileItem, getIconForType, getColorForType } from '@/lib/mock-data';
import { MoreVertical, Star, Download, Share2, Trash } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FileListItemProps {
  file: FileItem;
  onNavigate: (folderId: string) => void;
  onDelete: (fileId: string) => void;
  onToggleStar: (fileId: string) => void;
  onSelect: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  selected: boolean;
}

export function FileListItem({ file, onNavigate, onDelete, onToggleStar, onSelect, onDownload, onShare, selected }: FileListItemProps) {
  const Icon = getIconForType(file.type);
  const iconColor = getColorForType(file.type);

  const handleDoubleClick = () => {
    if (file.type === 'folder') {
      onNavigate(file.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group flex items-center p-2 rounded-lg border-b last:border-none hover:bg-muted/50 transition-colors cursor-pointer select-none",
        selected && "bg-muted"
      )}
      onClick={() => onSelect(file)}
      onDoubleClick={handleDoubleClick}
    >
      <div className="w-10 flex justify-center mr-3">
        <Icon className={cn("h-5 w-5", iconColor)} />
      </div>
      
      <div className="flex-1 min-w-0 pr-4">
        <span className="font-medium text-sm truncate block">{file.name}</span>
      </div>

      <div className="w-32 text-xs text-muted-foreground hidden sm:block">
        {file.modified}
      </div>

      <div className="w-20 text-xs text-muted-foreground text-right mr-4 hidden sm:block">
        {file.size}
      </div>

      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("h-8 w-8", file.starred ? "text-yellow-400 opacity-100" : "opacity-0 group-hover:opacity-100 text-muted-foreground")}
          onClick={(e) => { e.stopPropagation(); onToggleStar(file.id); }}
        >
          <Star className={cn("h-4 w-4", file.starred && "fill-current")} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleStar(file.id); }}>
              <Star className="h-4 w-4 mr-2" /> {file.starred ? 'Unstar' : 'Star'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(file); }}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDownload(file); }}>
              <Download className="h-4 w-4 mr-2" /> Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(file.id); }} className="text-destructive focus:text-destructive">
              <Trash className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
