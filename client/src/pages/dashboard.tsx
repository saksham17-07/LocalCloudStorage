import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { FileCard } from '@/components/file-system/file-card';
import { mockFiles, FileItem } from '@/lib/mock-data';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { FolderOpen, UploadCloud, FileQuestion, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('my-drive');

  // Breadcrumbs logic
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentId = currentFolderId;
    while (currentId) {
      const folder = files.find(f => f.id === currentId);
      if (folder) {
        breadcrumbs.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId || null; 
        if (folder.parentId === null) break;
      } else {
        break;
      }
    }
    return breadcrumbs;
  };

  const handleNavigate = (folderId: string | null) => {
    setCurrentFolderId(folderId);
  };

  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success("Item moved to trash");
  };

  const handleToggleStar = (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, starred: !f.starred } : f
    ));
  };

  const handleUpload = () => {
    toast.info("Uploading simulation...", {
      description: "Adding 'New Document.docx' to current folder."
    });
    
    setTimeout(() => {
      const newFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: `New Upload ${Math.floor(Math.random() * 100)}.jpg`,
        type: 'image',
        size: '2.5 MB',
        modified: new Date().toISOString().split('T')[0],
        starred: false,
        parentId: currentFolderId
      };
      setFiles(prev => [...prev, newFile]);
      toast.success("Upload complete");
    }, 1000);
  };

  const handleNewFolder = () => {
    const newFolder: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Folder',
      type: 'folder',
      size: '--',
      modified: new Date().toISOString().split('T')[0],
      starred: false,
      parentId: currentFolderId
    };
    setFiles(prev => [...prev, newFolder]);
    toast.success("Folder created");
  };

  // Filtering logic
  const filteredFiles = files.filter(file => {
    if (activeTab === 'starred') return file.starred;
    if (activeTab === 'recent') return true; // Show all sorted by date (mock)
    if (activeTab === 'trash') return false; // Mock empty trash for now
    
    // Default: My Drive (Hierarchical view)
    return file.parentId === currentFolderId || (currentFolderId === null && !file.parentId && file.parentId !== 'root'); 
  });

  // Sort folders first
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return 0;
  });

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setCurrentFolderId(null); }} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          onUpload={handleUpload} 
          onNewFolder={handleNewFolder}
          breadcrumbs={getBreadcrumbs()}
          onNavigate={handleNavigate}
        />
        
        <div className="flex-1 overflow-y-auto p-6">
          {sortedFiles.length > 0 ? (
             <div>
               <h2 className="text-lg font-semibold mb-4 capitalize">
                 {activeTab === 'my-drive' ? (currentFolderId ? files.find(f => f.id === currentFolderId)?.name : 'My Drive') : activeTab}
               </h2>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                 <AnimatePresence>
                   {sortedFiles.map((file) => (
                     <FileCard 
                       key={file.id} 
                       file={file} 
                       onNavigate={handleNavigate}
                       onDelete={handleDelete}
                       onToggleStar={handleToggleStar}
                     />
                   ))}
                 </AnimatePresence>
               </div>
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              {activeTab === 'trash' ? (
                <>
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Trash className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-lg font-medium">Trash is empty</p>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <FolderOpen className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-lg font-medium">This folder is empty</p>
                  <Button variant="link" onClick={handleUpload}>Upload a file</Button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
