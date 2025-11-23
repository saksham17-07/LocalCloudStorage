import { Folder, FileText, Image, Music, Video, Archive, File } from "lucide-react";

export type FileType = 'folder' | 'image' | 'video' | 'doc' | 'audio' | 'archive' | 'pdf';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: string;
  modified: string;
  starred: boolean;
  shared?: boolean;
  parentId?: string | null; // For folder hierarchy
  trashed?: boolean; // New field for trash functionality
}

export const mockFiles: FileItem[] = [
  { id: '1', name: 'Project Alpha', type: 'folder', size: '--', modified: '2025-01-15', starred: true, parentId: null, trashed: false },
  { id: '2', name: 'Design Assets', type: 'folder', size: '--', modified: '2025-01-10', starred: false, parentId: null, trashed: false },
  { id: '3', name: 'Q4 Report.pdf', type: 'pdf', size: '2.4 MB', modified: '2025-01-20', starred: true, parentId: null, trashed: false },
  { id: '4', name: 'Team Photo.jpg', type: 'image', size: '4.1 MB', modified: '2025-01-18', starred: false, parentId: null, trashed: false },
  { id: '5', name: 'Budget 2025.xlsx', type: 'doc', size: '1.2 MB', modified: '2025-01-22', starred: false, parentId: null, trashed: false },
  { id: '6', name: 'Intro Music.mp3', type: 'audio', size: '8.5 MB', modified: '2025-01-05', starred: false, parentId: null, trashed: false },
  { id: '7', name: 'Demo Recording.mp4', type: 'video', size: '124 MB', modified: '2025-01-21', starred: false, parentId: null, trashed: false },
  { id: '8', name: 'Source Code.zip', type: 'archive', size: '45 MB', modified: '2025-01-12', starred: false, parentId: null, trashed: false },
  
  // Inside Project Alpha (id: 1)
  { id: '11', name: 'Wireframes', type: 'folder', size: '--', modified: '2025-01-15', starred: false, parentId: '1', trashed: false },
  { id: '12', name: 'Specs.docx', type: 'doc', size: '500 KB', modified: '2025-01-16', starred: false, parentId: '1', trashed: false },
];

export const getIconForType = (type: FileType) => {
  switch (type) {
    case 'folder': return Folder;
    case 'image': return Image;
    case 'video': return Video;
    case 'audio': return Music;
    case 'archive': return Archive;
    case 'doc':
    case 'pdf': return FileText;
    default: return File;
  }
};

export const getColorForType = (type: FileType) => {
  switch (type) {
    case 'folder': return 'text-blue-500 fill-blue-500/20';
    case 'image': return 'text-purple-500 fill-purple-500/20';
    case 'video': return 'text-red-500 fill-red-500/20';
    case 'audio': return 'text-yellow-500 fill-yellow-500/20';
    case 'archive': return 'text-orange-500 fill-orange-500/20';
    case 'pdf': return 'text-red-600 fill-red-600/20';
    case 'doc': return 'text-blue-400 fill-blue-400/20';
    default: return 'text-gray-500 fill-gray-500/20';
  }
};
