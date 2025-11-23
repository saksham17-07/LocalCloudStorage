import { FileItem, getIconForType, getColorForType } from '@/lib/mock-data';
import { X, Download, Share2, Star, Info, Calendar, HardDrive, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FileDetailsProps {
  file: FileItem | null;
  onClose: () => void;
  onToggleStar: (fileId: string) => void;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
}

export function FileDetails({ file, onClose, onToggleStar, onDownload, onShare }: FileDetailsProps) {
  if (!file) return null;

  const Icon = getIconForType(file.type);
  const iconColor = getColorForType(file.type);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-80 border-l bg-card flex flex-col h-full shadow-xl z-10"
    >
      <div className="p-4 border-b flex items-center justify-between">
        <span className="font-semibold text-sm flex items-center gap-2">
          <Info className="h-4 w-4" /> Details
        </span>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className={cn("h-24 w-24 rounded-2xl flex items-center justify-center mb-4 bg-muted/30", iconColor.split(' ')[0].replace('text-', 'bg-').replace('500', '100').replace('600', '100').replace('400', '100'))}>
            <Icon className={cn("h-12 w-12", iconColor)} />
          </div>
          <h3 className="font-semibold text-lg break-all">{file.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{file.type}</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
           <Button variant="outline" size="icon" onClick={() => onToggleStar(file.id)}>
            <Star className={cn("h-4 w-4", file.starred ? "fill-yellow-400 text-yellow-400" : "")} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onShare(file)}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onDownload(file)}>
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="mb-6" />

        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider text-xs">Information</h4>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Type className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-medium capitalize">{file.type}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <HardDrive className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Size</p>
                <p className="text-sm font-medium">{file.size}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Modified</p>
                <p className="text-sm font-medium">{file.modified}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
