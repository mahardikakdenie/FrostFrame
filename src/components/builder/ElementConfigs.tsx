import React from 'react';
import { ColorPicker } from './ColorPicker';
import { cn } from '../../lib/utils';
import { 
  Type, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Maximize2, 
  MoveHorizontal, 
  ArrowUpDown, 
  TextQuote, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Palette,
  Search,
  HelpCircle,
  LucideIcon,
  Settings2Icon,
  Play
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { ResponsiveLabel, updateResponsiveValue } from './ResponsiveConfig';

interface ElementConfigProps {
  value: any;
  onChange: (key: string, val: any) => void;
  elementPath: string;
  activeFormatting?: any;
}

export const HeadingConfig = ({ value, onChange, elementPath, activeFormatting }: ElementConfigProps) => {
  const activeDevice = useUIStore(state => state.activeDevice);
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  
  const currentColor = activeFormatting?.color || attributes.color || "#0f172a";
  const getPath = (key: string) => elementPath ? `${elementPath}.${key}` : key;

  const isSpecialNode = ['heroHeadline', 'heroSubheadline', 'heroBadge', 'paragraphElement'].some(t => 
    elementPath.toLowerCase().includes(t.toLowerCase()) || 
    activeFormatting?.nodeType === t ||
    (value?.type === t)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      {(isSpecialNode || !elementPath.includes('title')) && (
        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Body Content</label>
          <textarea 
            value={attributes.textContent || value?.textContent || (isObject ? value.text : value) || ''}
            onChange={(e) => onChange(isObject ? getPath('textContent') : 'textContent', e.target.value)}
            className="w-full p-4 text-xs font-bold border border-slate-200 rounded-2xl bg-white shadow-inner focus:ring-2 focus:ring-indigo-100 outline-none min-h-[100px] resize-none transition-all leading-relaxed"
            placeholder="Type your content here..."
          />
        </div>
      )}

      <div className="space-y-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <TextQuote className="w-3.5 h-3.5 text-indigo-500" />
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic text-left">Typography Details</h4>
        </div>

        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Structure</label>
          <div className="flex gap-1.5 flex-wrap">
            {['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].map(tag => (
              <button 
                key={tag}
                onClick={() => onChange(getPath('level'), tag)}
                className={cn(
                  "px-3 py-2 text-[10px] font-black rounded-lg border transition-all uppercase",
                  (attributes.level || 'h1') === tag ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Font Weight</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'L', value: 'font-light' },
              { label: 'M', value: 'font-medium' },
              { label: 'B', value: 'font-bold' },
              { label: 'X', value: 'font-black' },
            ].map(w => (
              <button 
                key={w.value}
                onClick={() => onChange(getPath('fontWeight'), w.value)}
                className={cn(
                  "py-2 text-[10px] font-bold rounded-lg border transition-all",
                  (attributes.fontWeight || 'font-black') === w.value ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-400 border-slate-100 hover:border-indigo-200"
                )}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
           <ResponsiveLabel>Font Size (rem)</ResponsiveLabel>
           <div className="space-y-2">
              <input 
                type="range" 
                min="1" max="10" step="0.5"
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                value={attributes.fontSizeScale || 4}
                onChange={(e) => onChange(getPath('fontSizeScale'), parseFloat(e.target.value))}
              />
           </div>
        </div>

        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Alignment</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <AlignLeft className="w-3.5 h-3.5" />, value: 'text-left' },
              { icon: <AlignCenter className="w-3.5 h-3.5" />, value: 'text-center' },
              { icon: <AlignRight className="w-3.5 h-3.5" />, value: 'text-right' },
            ].map(item => (
              <button 
                key={item.value} 
                onClick={() => onChange(getPath('textAlign'), item.value)}
                className={cn(
                  "p-3 rounded-xl flex flex-col items-center justify-center transition-all border",
                  (attributes.textAlign || 'text-left') === item.value ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200"
                )}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-slate-100">
        <ColorPicker 
          label="Text Color" 
          value={currentColor} 
          onChange={(color) => onChange(getPath('color'), color)} 
        />
      </div>
    </div>
  );
};

export const MediaConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  const openMediaModal = useUIStore(state => state.openMediaModal);

  const handleOpenModal = () => {
    openMediaModal(attributes.id || 'media-edit', (newUrl: string) => {
      onChange('url', newUrl);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Visual Asset</span>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">MEDIA CONFIG</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Source URL</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
              value={attributes.url || ''}
              onChange={(e) => onChange('url', e.target.value)}
              placeholder="https://..."
            />
            <button 
              onClick={handleOpenModal}
              className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  const openMediaModal = useUIStore(state => state.openMediaModal);

  const sourceType = attributes.sourceType || 'link';

  const handleOpenSourceModal = () => {
    openMediaModal(attributes.id || 'video-src', (newUrl: string) => {
      onChange('src', newUrl);
      onChange('sourceType', 'upload');
    });
  };

  const handleOpenPosterModal = () => {
    openMediaModal(attributes.id || 'video-poster', (newUrl: string) => {
      onChange('poster', newUrl);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Motion Asset</span>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">VIDEO CONFIG</h2>
      </div>

      <div className="space-y-6">
        {/* Source Type Selector */}
        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Video Source Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'link', label: 'Direct Link', icon: <Maximize2 className="w-3 h-3" /> },
              { id: 'upload', label: 'Local Upload', icon: <Plus className="w-3 h-3" /> },
              { id: 'youtube', label: 'YouTube URL', icon: <Play className="w-3 h-3" /> },
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => onChange('sourceType', mode.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                  sourceType === mode.id ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200"
                )}
              >
                {mode.icon}
                <span className="text-[7px] font-black uppercase tracking-tighter leading-none">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Source Input */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">
            {sourceType === 'youtube' ? 'YouTube URL' : sourceType === 'upload' ? 'Uploaded Video File' : 'Direct Video Link (.mp4, .webm)'}
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
              value={attributes.src || ''}
              onChange={(e) => onChange('src', e.target.value)}
              placeholder={sourceType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
            />
            {sourceType === 'upload' && (
              <button 
                onClick={handleOpenSourceModal}
                className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {sourceType !== 'youtube' && (
          <div className="space-y-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Poster Image (Thumbnail)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                value={attributes.poster || ''}
                onChange={(e) => onChange('poster', e.target.value)}
                placeholder="https://...jpg"
              />
              <button 
                onClick={handleOpenPosterModal}
                className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
           <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Autoplay</label>
              <button 
                onClick={() => onChange('autoplay', !attributes.autoplay)}
                className={cn(
                  "w-full py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border",
                  attributes.autoplay ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"
                )}
              >
                {attributes.autoplay ? 'Enabled' : 'Disabled'}
              </button>
           </div>
           <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Loop Video</label>
              <button 
                onClick={() => onChange('loop', !attributes.loop)}
                className={cn(
                  "w-full py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border",
                  attributes.loop ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"
                )}
              >
                {attributes.loop ? 'Enabled' : 'Disabled'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export const BackgroundConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  const openMediaModal = useUIStore(state => state.openMediaModal);

  const handleOpenBgModal = () => {
    openMediaModal(attributes.id || 'bg-edit', (newUrl: string) => {
      onChange('bgImage', newUrl);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Canvas Styling</span>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">BACKGROUND SYSTEM</h2>
      </div>

      <div className="space-y-8">
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-6">
           <ColorPicker 
            label="Base Color" 
            value={attributes.background || attributes.bgColor || 'transparent'} 
            onChange={(color) => onChange('background', color)} 
          />
        </div>

        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-6">
           <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block italic">Image Backdrop</label>
           </div>
           
           <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
              value={attributes.bgImage || ''}
              onChange={(e) => onChange('bgImage', e.target.value)}
            />
            <button 
              onClick={handleOpenBgModal}
              className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {attributes.bgImage && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] space-y-6">
               <ColorPicker 
                 label="Overlay Color" 
                 value={attributes.bgOverlay || '#0f172a'} 
                 onChange={(color) => onChange('bgOverlay', color)} 
               />
               
               <div className="space-y-3">
                  <input 
                    type="range" 
                    min="0" max="100" step="5"
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    value={attributes.bgOpacity || 40}
                    onChange={(e) => onChange('bgOpacity', parseInt(e.target.value))}
                  />
               </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ButtonConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const buttons = isObject && Array.isArray(value.buttons) ? value.buttons : [];

  const updateButton = (index: number, key: string, val: any) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], [key]: val };
    onChange('buttons', newButtons);
  };

  const addButton = () => {
    const newButtons = [...buttons, { text: 'NEW BUTTON', link: '#', color: '#4f46e5', variant: 'secondary' }];
    onChange('buttons', newButtons);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter text-left">BUTTON GROUP</h2>
         <button onClick={addButton} className="bg-indigo-600 text-white p-2 rounded-xl"><Plus className="w-4 h-4" /></button>
      </div>

      <div className="space-y-4">
        {buttons.map((btn: any, idx: number) => (
          <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
             <input 
               type="text" 
               className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold"
               value={btn.text}
               onChange={(e) => updateButton(idx, 'text', e.target.value)}
             />
          </div>
        ))}
      </div>
    </div>
  );
};

export const IconConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  const [searchTerm, setSearchQuery] = React.useState('');

  const popularIcons = ['Star', 'Zap', 'Heart', 'Shield', 'Smartphone', 'Search', 'Check', 'X', 'Layout', 'Grid3X3'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter text-left">ICON PICKER</h2>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input 
          type="text" 
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          value={searchTerm}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search icons..."
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {popularIcons.map(name => {
          const Icon = (LucideIcons as any)[name] || HelpCircle;
          return (
            <button 
              key={name}
              onClick={() => onChange('icon', name)}
              className={cn(
                "aspect-square flex items-center justify-center rounded-lg border",
                attributes.icon === name ? "bg-indigo-600 text-white" : "bg-white text-slate-400"
              )}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>
      
      <div className="pt-6 border-t border-slate-100">
        <ColorPicker 
          label="Icon Color" 
          value={attributes.color || '#4f46e5'} 
          onChange={(color) => onChange('color', color)} 
        />
      </div>
    </div>
  );
};

export const ParagraphConfig = ({ value, onChange, elementPath, activeFormatting }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  const currentColor = activeFormatting?.color || attributes.color || "#64748b";
  const getPath = (key: string) => elementPath ? `${elementPath}.${key}` : key;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Typography</span>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">PARAGRAPH</h2>
      </div>

      <div className="space-y-4">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Body Content</label>
        <textarea 
          value={attributes.textContent || value?.textContent || (isObject ? value.text : value) || ''}
          onChange={(e) => onChange(isObject ? getPath('textContent') : 'textContent', e.target.value)}
          className="w-full p-4 text-xs font-bold border border-slate-200 rounded-2xl bg-white shadow-inner focus:ring-2 focus:ring-indigo-100 outline-none min-h-[100px] resize-none transition-all leading-relaxed"
          placeholder="Type your paragraph content here..."
        />
        <p className="text-[8px] text-slate-400 font-medium italic text-left">Changes here update the canvas in real-time.</p>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-100">
        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Alignment</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <AlignLeft className="w-3.5 h-3.5" />, value: 'text-left' },
              { icon: <AlignCenter className="w-3.5 h-3.5" />, value: 'text-center' },
              { icon: <AlignRight className="w-3.5 h-3.5" />, value: 'text-right' },
            ].map(item => (
              <button 
                key={item.value} 
                onClick={() => onChange(getPath('textAlign'), item.value)}
                className={cn(
                  "p-3 rounded-xl flex flex-col items-center justify-center transition-all border",
                  (attributes.textAlign || 'text-left') === item.value ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200"
                )}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        <ColorPicker 
          label="Text Color" 
          value={currentColor} 
          onChange={(color) => onChange(getPath('color'), color)} 
        />
      </div>
    </div>
  );
};

export const DividerConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Visual Elements</span>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">DIVIDER LINE</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Thickness</label>
           <div className="flex gap-2 flex-wrap">
             {['1px', '2px', '4px', '8px'].map(t => (
               <button
                 key={t}
                 onClick={() => onChange('thickness', t)}
                 className={cn(
                   "px-4 py-2 text-[10px] font-black uppercase rounded-lg border transition-all",
                   (attributes.thickness || '2px') === t ? "bg-indigo-600 border-indigo-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-200"
                 )}
               >
                 {t}
               </button>
             ))}
           </div>
        </div>

        <div className="space-y-4">
           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Width</label>
           <div className="flex gap-2 flex-wrap">
             {['100%', '75%', '50%', '25%'].map(w => (
               <button
                 key={w}
                 onClick={() => onChange('width', w)}
                 className={cn(
                   "px-4 py-2 text-[10px] font-black uppercase rounded-lg border transition-all",
                   (attributes.width || '100%') === w ? "bg-indigo-600 border-indigo-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-200"
                 )}
               >
                 {w}
               </button>
             ))}
           </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
           <ColorPicker 
             label="Divider Color" 
             value={attributes.color || 'var(--primary-color)'} 
             onChange={(color) => onChange('color', color)} 
           />
        </div>
      </div>
    </div>
  );
};

export const SpacerConfig = ({ value, onChange }: ElementConfigProps) => {
  const activeDevice = useUIStore(state => state.activeDevice);
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Layout Helper</span>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">EMPTY SPACER</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
           <ResponsiveLabel>Spacer Height (px)</ResponsiveLabel>
           <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>0px</span>
                <span className="text-indigo-600 font-black">
                  {typeof attributes.height === 'object' 
                    ? (attributes.height[activeDevice] || '40px') 
                    : (attributes.height || '40px')}
                </span>
                <span>200px</span>
              </div>
              <input 
                type="range" 
                min="0" max="200" step="5"
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                value={(() => {
                  const val = typeof attributes.height === 'object' 
                    ? (attributes.height[activeDevice] || '40px') 
                    : (attributes.height || '40px');
                  return parseInt(val.toString().replace(/[^\d]/g, '')) || 40;
                })()}
                onChange={(e) => {
                  const val = `${e.target.value}px`;
                  const newVal = updateResponsiveValue(attributes.height, activeDevice, val);
                  onChange('height', newVal);
                }}
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export const AdvancedConfig = ({ value, onChange }: ElementConfigProps) => {
  const activeDevice = useUIStore(state => state.activeDevice);
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};

  return (
    <div className="space-y-8 pt-8 mt-8 border-t-4 border-slate-100 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Settings2Icon className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic text-left">Advanced Positioning</h3>
      </div>

      {/* Margin */}
      <div className="space-y-6 bg-slate-50 p-6 border border-slate-100 rounded-[2rem]">
        <div className="space-y-4">
          <ResponsiveLabel>Margin Top (Supports Negative)</ResponsiveLabel>
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-bold text-slate-500">
              <span>-150px</span>
              <span className="text-emerald-600 font-black">
                {typeof attributes.marginTop === 'object' ? (attributes.marginTop[activeDevice] || '0px') : (attributes.marginTop || '0px')}
              </span>
              <span>150px</span>
            </div>
            <input 
              type="range" min="-150" max="150" step="5"
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              value={(() => {
                const val = typeof attributes.marginTop === 'object' ? (attributes.marginTop[activeDevice] || '0') : (attributes.marginTop || '0');
                return parseInt(val.toString().replace(/[^\d-]/g, '')) || 0;
              })()}
              onChange={(e) => {
                const newVal = updateResponsiveValue(attributes.marginTop, activeDevice, `${e.target.value}px`);
                onChange('marginTop', newVal);
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <ResponsiveLabel>Margin Bottom</ResponsiveLabel>
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-bold text-slate-500">
              <span>0px</span>
              <span className="text-emerald-600 font-black">
                {typeof attributes.marginBottom === 'object' ? (attributes.marginBottom[activeDevice] || '0px') : (attributes.marginBottom || '0px')}
              </span>
              <span>150px</span>
            </div>
            <input 
              type="range" min="0" max="150" step="5"
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              value={(() => {
                const val = typeof attributes.marginBottom === 'object' ? (attributes.marginBottom[activeDevice] || '0') : (attributes.marginBottom || '0');
                return parseInt(val.toString().replace(/[^\d]/g, '')) || 0;
              })()}
              onChange={(e) => {
                const newVal = updateResponsiveValue(attributes.marginBottom, activeDevice, `${e.target.value}px`);
                onChange('marginBottom', newVal);
              }}
            />
          </div>
        </div>
      </div>

      {/* Padding */}
      <div className="space-y-6 bg-slate-50 p-6 border border-slate-100 rounded-[2rem]">
        <div className="space-y-4">
          <ResponsiveLabel>Internal Padding</ResponsiveLabel>
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-bold text-slate-500">
              <span>0 (None)</span>
              <span className="text-emerald-600 font-black">
                {typeof attributes.padding === 'object' ? (attributes.padding[activeDevice] || '0') : (attributes.padding || '0')}
              </span>
              <span>16 (Max)</span>
            </div>
            <input 
              type="range" min="0" max="16" step="1"
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              value={(() => {
                const val = typeof attributes.padding === 'object' ? (attributes.padding[activeDevice] || '0') : (attributes.padding || '0');
                return parseInt(val.toString().replace(/[^\d]/g, '')) || 0;
              })()}
              onChange={(e) => {
                const val = e.target.value === '0' ? '' : `p-${e.target.value}`;
                const newVal = updateResponsiveValue(attributes.padding, activeDevice, val);
                onChange('padding', newVal);
              }}
            />
          </div>
        </div>
      </div>

      {/* Z-Index */}
      <div className="space-y-4">
         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Z-Index (Stack Order)</label>
         <div className="flex gap-2 flex-wrap">
           {['auto', '0', '10', '20', '30', '40', '50'].map(z => (
             <button
               key={z}
               onClick={() => onChange('zIndex', z === 'auto' ? null : `z-${z}`)}
               className={cn(
                 "px-3 py-2 text-[9px] font-black uppercase rounded-lg border transition-all",
                 (attributes.zIndex || 'auto') === (z === 'auto' ? 'auto' : `z-${z}`) ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-500 hover:border-emerald-200"
               )}
             >
               {z}
             </button>
           ))}
         </div>
         <p className="text-[8px] text-slate-400 font-medium italic text-left">Useful when overlapping elements with negative margin.</p>
      </div>
    </div>
  );
};
