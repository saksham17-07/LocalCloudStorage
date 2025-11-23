import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from "wouter";
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { FileCard } from '@/components/file-system/file-card';
import { FileListItem } from '@/components/file-system/file-list-item';
import { FileDetails } from '@/components/file-system/file-details';
import { SettingsModal } from '@/components/modals/settings-modal';
import { mockFiles, FileItem, FileType } from '@/lib/mock-data';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { FolderOpen, UploadCloud, FileQuestion, Trash, RefreshCcw, Ban, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('my-drive');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState({ name: "Guest User", email: "guest@example.com" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  // Calculate Storage
  const calculateStorage = () => {
    // Mock calculation: Sum up mock sizes
    // For mock data, we'll assume some random sizes if string is not parsable
    let totalMB = 0;
    files.forEach(f => {
      if (f.trashed) return; // Don't count trash? Or do? Usually trash counts. Let's count it.
      
      if (f.size.endsWith('MB')) {
        totalMB += parseFloat(f.size);
      } else if (f.size.endsWith('KB')) {
        totalMB += parseFloat(f.size) / 1024;
      } else if (f.size.endsWith('GB')) {
        totalMB += parseFloat(f.size) * 1024;
      }
    });
    // Add base usage for "Project Alpha" mock items that have '--'
    totalMB += 150; 
    return totalMB;
  };

  const storageUsed = calculateStorage();
  const storageLimit = 15 * 1024; // 15 GB in MB

  // Auth Check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      setLocation("/auth");
    } else {
      setUser({
        name: localStorage.getItem("userName") || "User",
        email: localStorage.getItem("userEmail") || "user@example.com"
      });
    }
  }, [setLocation]);

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
    setSelectedFile(null);
    setSearchQuery(''); // Clear search when navigating
  };

  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, trashed: true } : f));
    if (selectedFile?.id === fileId) setSelectedFile(null);
    toast.success("Item moved to trash", {
      action: {
        label: "Undo",
        onClick: () => handleRestore(fileId)
      }
    });
  };

  const handleRestore = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, trashed: false } : f));
    toast.success("Item restored");
  };

  const handleDeleteForever = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) setSelectedFile(null);
    toast.success("Item permanently deleted");
  };

  const handleToggleStar = (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, starred: !f.starred } : f
    ));
    if (selectedFile?.id === fileId) {
      setSelectedFile(prev => prev ? { ...prev, starred: !prev.starred } : null);
    }
  };

  // --- New Handlers for Download and Share ---

  const handleDownload = (file: FileItem) => {
    if (file.type === 'folder') {
        toast.error("Cannot download folders in this prototype.");
        return;
    }
    
    toast.success(`Downloading ${file.name}...`, {
        description: "File download started."
    });

    // Simulate download delay
    setTimeout(() => {
        toast.success("Download complete!");
    }, 2000);
  };

  const handleShare = (file: FileItem) => {
    const shareLink = `https://minicloud.app/share/${file.id}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard!", {
        description: "Anyone with the link can view this file."
    });
  };

  // -------------------------------------------

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    toast.info("Logging out...");
    setTimeout(() => setLocation("/auth"), 500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      let type: FileType = 'doc';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';
      else if (file.type === 'application/pdf') type = 'pdf';
      else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('tar')) type = 'archive';

      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      const sizeStr = parseFloat(sizeInMB) < 1 ? `${(file.size / 1024).toFixed(1)} KB` : `${sizeInMB} MB`;

      const newFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: type,
        size: sizeStr,
        modified: new Date().toISOString().split('T')[0],
        starred: false,
        parentId: currentFolderId,
        trashed: false
      };

      setFiles(prev => [...prev, newFile]);
      toast.success("Upload complete");
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleNewFolder = () => {
    const newFolder: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Folder',
      type: 'folder',
      size: '--',
      modified: new Date().toISOString().split('T')[0],
      starred: false,
      parentId: currentFolderId,
      trashed: false
    };
    setFiles(prev => [...prev, newFolder]);
    toast.success("Folder created");
  };

  const handleSelectFile = (file: FileItem) => {
    setSelectedFile(file);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedFile(null);
    }
  };

  // Filtering logic
  const filteredFiles = files.filter(file => {
    // Global Search Filter
    if (searchQuery) {
      return file.name.toLowerCase().includes(searchQuery.toLowerCase()) && !file.trashed;
    }

    // Tab Filters
    if (activeTab === 'trash') return file.trashed;
    if (file.trashed) return false;

    if (activeTab === 'starred') return file.starred;
    if (activeTab === 'recent') return true; 
    
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
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => { setActiveTab(tab); setCurrentFolderId(null); setSelectedFile(null); setSearchQuery(''); }} 
        onSettingsClick={() => setShowSettings(true)}
        onLogoutClick={handleLogout}
        storageUsed={storageUsed}
        storageLimit={storageLimit}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onUpload={handleUploadClick} 
          onNewFolder={handleNewFolder}
          breadcrumbs={getBreadcrumbs()}
          onNavigate={handleNavigate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLogout={handleLogout}
          currentUser={user}
        />
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
        />
        
        <div className="flex-1 flex overflow-hidden">
          <main 
            className="flex-1 overflow-y-auto p-6"
            onClick={handleBackgroundClick}
          >
            {sortedFiles.length > 0 ? (
              <div onClick={handleBackgroundClick}>
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-lg font-semibold capitalize flex items-center gap-2">
                    {searchQuery ? (
                      <>
                        <Search className="h-5 w-5 text-primary" />
                        Search results for "{searchQuery}"
                      </>
                    ) : (
                      activeTab === 'my-drive' ? (currentFolderId ? files.find(f => f.id === currentFolderId)?.name : 'My Drive') : activeTab
                    )}
                  </h2>
                  <span className="text-sm text-muted-foreground">{sortedFiles.length} items</span>
                </div>
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <AnimatePresence mode='popLayout'>
                      {sortedFiles.map((file) => (
                        <div key={file.id} className="relative group">
                          <FileCard 
                            file={file} 
                            onNavigate={handleNavigate}
                            onDelete={activeTab === 'trash' ? handleDeleteForever : handleDelete}
                            onToggleStar={handleToggleStar}
                            onSelect={handleSelectFile}
                            selected={selectedFile?.id === file.id}
                            onDownload={handleDownload}
                            onShare={handleShare}
                          />
                          {activeTab === 'trash' && (
                             <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button 
                                 size="icon" 
                                 variant="secondary" 
                                 className="h-6 w-6"
                                 onClick={(e) => { e.stopPropagation(); handleRestore(file.id); }}
                                 title="Restore"
                               >
                                 <RefreshCcw className="h-3 w-3" />
                               </Button>
                             </div>
                          )}
                        </div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="border rounded-lg bg-card overflow-hidden">
                    <div className="grid grid-cols-[auto_1fr_8rem_5rem_5rem] gap-4 p-3 bg-muted/40 text-xs font-medium text-muted-foreground border-b">
                      <div className="w-10 text-center">Type</div>
                      <div>Name</div>
                      <div className="hidden sm:block">Modified</div>
                      <div className="text-right hidden sm:block">Size</div>
                      <div className="text-center">Actions</div>
                    </div>
                    <div className="divide-y">
                      <AnimatePresence mode='popLayout'>
                        {sortedFiles.map((file) => (
                          <div key={file.id} className="group relative">
                             <FileListItem 
                              file={file} 
                              onNavigate={handleNavigate}
                              onDelete={activeTab === 'trash' ? handleDeleteForever : handleDelete}
                              onToggleStar={handleToggleStar}
                              onSelect={handleSelectFile}
                              selected={selectedFile?.id === file.id}
                              onDownload={handleDownload}
                              onShare={handleShare}
                            />
                             {activeTab === 'trash' && (
                               <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                   size="sm" 
                                   variant="ghost" 
                                   className="h-7 text-xs"
                                   onClick={(e) => { e.stopPropagation(); handleRestore(file.id); }}
                                 >
                                   Restore
                                 </Button>
                               </div>
                             )}
                          </div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                {searchQuery ? (
                  <>
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 opacity-50" />
                    </div>
                    <p className="text-lg font-medium">No results found for "{searchQuery}"</p>
                    <p className="text-sm text-muted-foreground">Try checking your spelling or using different keywords</p>
                  </>
                ) : activeTab === 'trash' ? (
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
                    <Button variant="link" onClick={handleUploadClick}>Upload a file</Button>
                  </>
                )}
              </div>
            )}
          </main>

          <AnimatePresence>
            {selectedFile && (
              <FileDetails 
                file={selectedFile} 
                onClose={() => setSelectedFile(null)} 
                onToggleStar={handleToggleStar}
                onDownload={handleDownload}
                onShare={handleShare}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
      <Toaster position="bottom-right" />
    </div>
  );
}
