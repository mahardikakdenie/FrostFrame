import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Upload, Image as ImageIcon, Loader2, Download } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

export const MediaLibraryModal = () => {
  const { mediaModal, closeMediaModal } = useUIStore();
  const [activeTab, setActiveTab] = useState<'unsplash' | 'upload'>('unsplash');
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mediaModal.isOpen) {
       if (mediaModal.type === 'image') {
          setActiveTab('unsplash');
          fetchUnsplashImages('landscape');
       } else {
          setActiveTab('upload');
       }
    }
  }, [mediaModal.isOpen, mediaModal.type]);

  const fetchUnsplashImages = async (query: string) => {
    if (!UNSPLASH_ACCESS_KEY) {
       console.error("Unsplash Access Key is missing!");
       return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=20&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setImages(data.results || []);
    } catch (error) {
      console.error("Error fetching Unsplash images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchUnsplashImages(searchQuery);
    }
  };

  const handleSelect = (url: string) => {
    if (mediaModal.onSelect) {
      mediaModal.onSelect(url);
    }
    closeMediaModal();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
           const url = event.target?.result as string;
           handleSelect(url);
        };
        reader.readAsDataURL(file);
     }
  };

  if (!mediaModal.isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMediaModal}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-slate-900 w-full max-w-5xl h-[80vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 dark:border-slate-800"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                   <ImageIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                   <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-900 dark:text-white leading-none">Media Library</h3>
                   <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Lando Studio Assets</span>
                </div>
             </div>

             <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {mediaModal.type === 'image' && (
                  <button 
                    onClick={() => setActiveTab('unsplash')}
                    className={cn(
                      "px-6 py-2 rounded-lg text-[10px] font-black uppercase italic transition-all",
                      activeTab === 'unsplash' ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500"
                    )}
                  >Unsplash</button>
                )}
                <button 
                  onClick={() => setActiveTab('upload')}
                  className={cn(
                    "px-6 py-2 rounded-lg text-[10px] font-black uppercase italic transition-all",
                    (activeTab === 'upload' || mediaModal.type === 'video') ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500"
                  )}
                >Upload Local</button>
             </div>

             <button 
               onClick={closeMediaModal}
               className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white"
             >
                <X className="w-6 h-6" />
             </button>
          </div>

          {/* Search Bar (Only for Unsplash) */}
          {activeTab === 'unsplash' && (
            <div className="px-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 shrink-0">
               <form onSubmit={handleSearch} className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search high-res photos..."
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </form>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
             {activeTab === 'unsplash' ? (
                isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 opacity-50">
                     <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                     <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-900 dark:text-white">Fetching Masterpieces...</span>
                  </div>
                ) : images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {images.map((img) => (
                        <motion.div 
                          key={img.id}
                          whileHover={{ y: -5 }}
                          onClick={() => handleSelect(img.urls.regular)}
                          className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg bg-slate-100 dark:bg-slate-800"
                        >
                           <img src={img.urls.small} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/20 transition-all" />
                           <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                              <span className="text-[8px] text-white font-bold uppercase tracking-widest italic truncate block">By {img.user.name}</span>
                           </div>
                        </motion.div>
                     ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 italic">
                     <ImageIcon className="w-16 h-16 mb-4 text-slate-900 dark:text-white" />
                     <p className="text-sm font-black text-slate-900 dark:text-white">No images found. Try a different keyword.</p>
                  </div>
                )
             ) : (
                <div className="h-full flex items-center justify-center p-12">
                   <div className="w-full max-w-md flex flex-col items-center gap-8 text-center">
                      <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                         <Upload className="w-10 h-10" />
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Upload from Computer</h4>
                         <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2 tracking-wide">
                           {mediaModal.type === 'video' ? 'MP4, WEBM or OGG (Max 20MB)' : 'JPG, PNG, WEBP or SVG (Max 5MB)'}
                         </p>
                      </div>
                      <label className="cursor-pointer group relative">
                         <input 
                           type="file" 
                           className="hidden" 
                           accept={mediaModal.type === 'video' ? "video/*" : "image/*"} 
                           onChange={handleFileUpload} 
                         />
                         <div className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase italic tracking-widest shadow-2xl hover:bg-black dark:hover:bg-slate-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                            <Download className="w-4 h-4" />
                            Select File
                         </div>
                      </label>
                   </div>
                </div>
             )}
          </div>

          {/* Footer Info */}
          <div className="px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0">
             <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">
               {mediaModal.type === 'image' ? 'Powered by Unsplash API' : 'Direct File Upload'}
             </span>
             <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase">Selected Node: {mediaModal.targetNodeId || 'None'}</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
