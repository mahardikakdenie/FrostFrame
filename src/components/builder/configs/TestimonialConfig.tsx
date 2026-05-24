import React from 'react';
import { ElementConfigProps } from './types';
import { cn } from '../../../lib/utils';
import { Star, Quote, User, Briefcase, Image as ImageIcon } from 'lucide-react';
import { useUIStore } from '../../../store/useUIStore';

export const TestimonialConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  const openMediaModal = useUIStore(state => state.openMediaModal);

  const author = attributes.author || { name: 'Jane Doe', role: 'CEO', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' };
  const logos = attributes.logos || ['GITHUB', 'VERCEL', 'STRIPE', 'AIRBNB'];

  const updateAuthor = (key: string, val: string) => {
    onChange('author', { ...author, [key]: val });
  };

  const handleOpenAvatarModal = () => {
    openMediaModal(attributes.id || 'testimonial-avatar', (newUrl: string) => {
      updateAuthor('avatar', newUrl);
    });
  };

  const updateLogo = (index: number, val: string) => {
    const newLogos = [...logos];
    newLogos[index] = val;
    onChange('logos', newLogos);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Social Proof</span>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">TESTIMONIAL CONFIG</h2>
      </div>

      <div className="space-y-6">
        {/* Quote */}
        <div className="space-y-2 text-left">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic flex items-center gap-1.5">
            <Quote className="w-3 h-3" /> Quote Text
          </label>
          <textarea 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 h-24 resize-none"
            value={attributes.quote || ''}
            onChange={(e) => onChange('quote', e.target.value)}
            placeholder="This product changed my life..."
          />
        </div>

        {/* Rating */}
        <div className="space-y-2 text-left">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic flex items-center gap-1.5">
            <Star className="w-3 h-3" /> Rating (1-5)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => onChange('rating', num)}
                className={cn(
                  "flex-1 py-2 rounded-lg transition-all border flex justify-center",
                  attributes.rating === num 
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                    : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-emerald-200"
                )}
              >
                <Star className={cn("w-4 h-4", attributes.rating >= num ? "fill-current" : "")} />
              </button>
            ))}
          </div>
        </div>

        {/* Author Details */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Author Information</h3>
          
          <div className="space-y-2 text-left">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic flex items-center gap-1.5">
              <User className="w-3 h-3" /> Name
            </label>
            <input 
              type="text" 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900"
              value={author.name}
              onChange={(e) => updateAuthor('name', e.target.value)}
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic flex items-center gap-1.5">
              <Briefcase className="w-3 h-3" /> Role / Title
            </label>
            <input 
              type="text" 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900"
              value={author.role}
              onChange={(e) => updateAuthor('role', e.target.value)}
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3" /> Avatar Image
            </label>
            <div className="flex gap-2 items-center">
              {author.avatar && (
                <img src={author.avatar} alt="Avatar" className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
              )}
              <input 
                type="text" 
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900"
                value={author.avatar}
                onChange={(e) => updateAuthor('avatar', e.target.value)}
              />
              <button 
                onClick={handleOpenAvatarModal}
                className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 text-left">
           <h3 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic">Partner Logos (Text)</h3>
           <div className="grid grid-cols-2 gap-2">
             {logos.map((logo: string, idx: number) => (
               <input 
                 key={idx}
                 type="text" 
                 className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-black uppercase text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 italic"
                 value={logo}
                 onChange={(e) => updateLogo(idx, e.target.value)}
                 placeholder={`LOGO ${idx + 1}`}
               />
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};