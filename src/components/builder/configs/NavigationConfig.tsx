import React from 'react';
import { ElementConfigProps } from './types';
import { cn } from '../../../lib/utils';
import { useUIStore } from '../../../store/useUIStore';
import { 
  Type, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  AlignLeft, 
  AlignCenter, 
  Menu, 
  Layout, 
  Zap, 
  Layers, 
  Maximize2,
  MousePointer2,
  Image as ImageIcon,
  Settings2,
  Globe,
  Palette
} from 'lucide-react';
import { ColorPicker } from '../ColorPicker';

export const NavigationConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  const openMediaModal = useUIStore(state => state.openMediaModal);

  const links = attributes.links || [];
  const logoText = attributes.logoText || 'LANDO';
  const logoType = attributes.logoType || 'text';
  const logoImage = attributes.logoImage || null;
  const logoHeight = attributes.logoHeight || '40px';
  const logoColor = attributes.logoColor || null;
  const textAlign = attributes.textAlign || 'text-left';
  const variant = attributes.variant || 'glass';
  const isSticky = attributes.isSticky || false;
  const paddingY = attributes.paddingY || 'p-6';
  const showCTA = attributes.showCTA !== undefined ? attributes.showCTA : true;
  const ctaText = attributes.ctaText || 'GET STARTED';

  const updateLink = (index: number, key: string, val: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [key]: val };
    onChange('links', newLinks);
  };

  const addLink = () => {
    onChange('links', [...links, { label: 'NEW LINK', url: '#' }]);
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_: any, i: number) => i !== index);
    onChange('links', newLinks);
  };

  const handleOpenLogoModal = () => {
    openMediaModal(attributes.id || 'nav-logo', (url: string) => {
      onChange('logoImage', url);
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500 text-left">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
           <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <Globe className="w-4 h-4" />
           </div>
           <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none italic">Frame Engine v2</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mt-2">NAVIGATOR CORE</h2>
      </div>

      <div className="space-y-10">
        {/* ── Section: Identity ────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-indigo-500" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Brand Identity</h3>
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
             <button 
               onClick={() => onChange('logoType', 'text')} 
               className={cn(
                 "flex-1 py-2.5 rounded-[0.9rem] text-[9px] font-black uppercase italic transition-all flex items-center justify-center gap-2",
                 logoType === 'text' ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-400"
               )}
             >
                <Type className="w-3.5 h-3.5" /> Text Signature
             </button>
             <button 
               onClick={() => onChange('logoType', 'image')} 
               className={cn(
                 "flex-1 py-2.5 rounded-[0.9rem] text-[9px] font-black uppercase italic transition-all flex items-center justify-center gap-2",
                 logoType === 'image' ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-400"
               )}
             >
                <ImageIcon className="w-3.5 h-3.5" /> Asset Logo
             </button>
          </div>

          {logoType === 'text' ? (
            <div className="space-y-5 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block ml-0.5">Primary Logo Text</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50/50 dark:bg-slate-900/50 rounded-[1.25rem] px-5 py-4 text-sm font-black italic text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-300 border border-slate-200 dark:border-slate-700"
                  value={logoText}
                  onChange={(e) => onChange('logoText', e.target.value)}
                  placeholder="e.g. LANDO"
                />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-0.5 italic">Signature Tint</label>
                 <ColorPicker 
                   label="Logo Color"
                   value={logoColor || '#6366f1'} 
                   onChange={(c) => onChange('logoColor', c)} 
                 />
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-in zoom-in-95 duration-300">
               <div className="space-y-2 text-left">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-0.5 italic">Brand Visual Asset</label>
                  <div className="flex gap-2">
                     <div className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 flex items-center gap-3">
                        {logoImage ? (
                           <img src={logoImage} alt="Preview" className="h-10 w-10 object-contain rounded-xl bg-white shadow-lg" />
                        ) : (
                           <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-slate-300" />
                           </div>
                        )}
                        <input 
                           type="text" 
                           className="flex-1 bg-transparent border-none text-[10px] font-bold text-indigo-500 outline-none truncate"
                           value={logoImage || ''}
                           placeholder="Drop asset URL here..."
                           onChange={(e) => onChange('logoImage', e.target.value)}
                        />
                     </div>
                     <button 
                        onClick={handleOpenLogoModal}
                        className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95 flex-shrink-0"
                     >
                        <Plus className="w-5 h-5" />
                     </button>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Logo Dynamic Height</label>
                    <span className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1 rounded-full italic">{logoHeight}</span>
                  </div>
                  <input 
                    type="range" 
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
                    min="24" max="120" step="2"
                    value={parseInt(logoHeight) || 40}
                    onChange={(e) => onChange('logoHeight', `${e.target.value}px`)}
                  />
               </div>
            </div>
          )}
        </div>

        {/* ── Section: Global Layout ──────────────────────────────────── */}
        <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800 text-left">
          <div className="flex items-center gap-2.5">
            <Layout className="w-4 h-4 text-indigo-500" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Layout Physics</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-0.5">Nav Alignment</label>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                 <button onClick={() => onChange('textAlign', 'text-left')} className={cn("flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all", textAlign === 'text-left' ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-lg" : "text-slate-400")}>
                    <AlignLeft className="w-4 h-4" />
                    <span className="text-[7px] font-black uppercase tracking-tighter">Left</span>
                 </button>
                 <button onClick={() => onChange('textAlign', 'text-center')} className={cn("flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all", textAlign === 'text-center' ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-lg" : "text-slate-400")}>
                    <AlignCenter className="w-4 h-4" />
                    <span className="text-[7px] font-black uppercase tracking-tighter">Center</span>
                 </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-0.5">Vertical Volume</label>
              <div className="relative">
                 <select 
                   value={paddingY}
                   onChange={(e) => onChange('paddingY', e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                 >
                   <option value="p-3">Minimal</option>
                   <option value="p-5">Balanced</option>
                   <option value="p-8">Spacious</option>
                   <option value="p-12">Grand</option>
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Maximize2 className="w-3.5 h-3.5" />
                 </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-5 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-[1.5rem] border border-indigo-100/50 dark:border-indigo-900/30">
             <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black uppercase italic text-slate-900 dark:text-white">Sticky Frame</span>
                </div>
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pin to viewport top</span>
             </div>
             <button 
               onClick={() => onChange('isSticky', !isSticky)}
               className={cn(
                 "w-14 h-7 rounded-full transition-all relative p-1.5",
                 isSticky ? "bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none" : "bg-slate-200 dark:bg-slate-700"
               )}
             >
                <div className={cn("w-4 h-4 bg-white rounded-full transition-all shadow-sm", isSticky ? "translate-x-7" : "translate-x-0")} />
             </button>
          </div>
        </div>

        {/* ── Section: Aesthetic ────────────────────────────────────────── */}
        <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800 text-left">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-indigo-500" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Aesthetic Engine</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'glass', label: 'Frosted' },
              { id: 'outline', label: 'Stroked' },
              { id: 'minimal', label: 'Pure' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => onChange('variant', v.id)}
                className={cn(
                  "py-4 rounded-2xl border-2 text-[9px] font-black uppercase italic tracking-widest transition-all",
                  variant === v.id 
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl scale-105 z-10" 
                    : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-300"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Section: Call to Action ──────────────────────────────────── */}
        <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800 text-left">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MousePointer2 className="w-4 h-4 text-indigo-500" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Conversion Area</h3>
              </div>
              <button 
                 onClick={() => onChange('showCTA', !showCTA)}
                 className={cn(
                   "w-10 h-5 rounded-full transition-all relative p-1",
                   showCTA ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                 )}
              >
                 <div className={cn("w-3 h-3 bg-white rounded-full transition-all", showCTA ? "translate-x-5" : "translate-x-0")} />
              </button>
           </div>

           {showCTA && (
             <div className="animate-in slide-in-from-top-3 duration-500 space-y-4">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-0.5">CTA Button Text</label>
                   <input 
                     type="text" 
                     className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-xs font-black italic tracking-widest text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                     value={ctaText}
                     onChange={(e) => onChange('ctaText', e.target.value.toUpperCase())}
                   />
                </div>
             </div>
           )}
        </div>

        {/* ── Section: Navigation Links ────────────────────────────────── */}
        <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800 text-left">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Settings2 className="w-4 h-4 text-indigo-500" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Traffic Routing</h3>
              </div>
              <button 
                onClick={addLink}
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-xl active:scale-90"
              >
                <Plus className="w-4 h-4" />
              </button>
           </div>
           
           <div className="space-y-4">
             {links.map((link: any, idx: number) => (
               <div key={idx} className="p-5 bg-white dark:bg-slate-800 rounded-[1.75rem] border border-slate-100 dark:border-slate-700 space-y-4 relative group/link-item shadow-sm hover:shadow-xl transition-all duration-300">
                 <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 rounded-l-full opacity-0 group-hover/link-item:opacity-100 transition-all" />
                 
                 <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-white bg-slate-900 dark:bg-slate-700 px-3 py-1 rounded-full uppercase italic tracking-widest">Link Point {idx + 1}</span>
                    <button 
                       onClick={() => removeLink(idx)}
                       className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>

                 <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Label</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-[11px] font-black text-slate-700 dark:text-slate-200 outline-none italic tracking-widest"
                        value={link.label}
                        onChange={(e) => updateLink(idx, 'label', e.target.value.toUpperCase())}
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">Routing Path</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                           <LinkIcon className="w-3.5 h-3.5" />
                        </div>
                        <input 
                          type="text" 
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-[11px] font-bold text-indigo-500 outline-none"
                          value={link.url}
                          onChange={(e) => updateLink(idx, 'url', e.target.value)}
                        />
                      </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>

           {links.length === 0 && (
             <div className="py-16 border-4 border-dashed border-slate-50 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 opacity-30">
               <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center mb-1 shadow-inner">
                 <LinkIcon className="w-7 h-7 text-slate-300" />
               </div>
               <span className="text-[11px] font-black uppercase italic tracking-[0.2em] text-slate-400">Zero Routing Data</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};