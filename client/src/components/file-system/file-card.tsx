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

interface FileCardProps {
  file: FileItem;
  onNavigate: (folderId: string) => void;
  onDelete: (fileId: string) => void;
  onToggleStar: (fileId: string) => void;
  onSelect: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  selected: boolean;
}

export function FileCard({ file, onNavigate, onDelete, onToggleStar, onSelect, onDownload, onShare, selected }: FileCardProps) {
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex flex-col p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-200 cursor-pointer select-none",
        selected && "ring-2 ring-primary ring-offset-2 bg-primary/5"
      )}
      onClick={() => onSelect(file)}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={cn("p-2.5 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors", iconColor.split(' ')[0].replace('text-', 'bg-').replace('500', '100').replace('600', '100').replace('400', '100'))}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
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

      <div className="mt-auto">
        <h3 className="font-medium text-sm truncate mb-1" title={file.name}>{file.name}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{file.size}</span>
          <span>{file.modified}</span>
        </div>
      </div>

      {file.starred && (
        <div className="absolute top-3 right-3 text-yellow-400">
          <Star className="h-4 w-4 fill-current" />
        </div>
      )}
    </motion.div>
  );
}
