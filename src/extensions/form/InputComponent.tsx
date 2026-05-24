import React from 'react';
import { cn } from '../../lib/utils';
import { FormFieldWrapper } from './FormFieldWrapper';

export const InputComponent = (props: any) => {
  const { node } = props;
  const { placeholder, label, required, name } = node.attrs;

  return (
    <FormFieldWrapper {...props} label="INPUT FIELD" type="Input">
      <div className="flex flex-col gap-2.5 text-left">
        {label && (
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative group/input">
          <input 
            type="text"
            name={name}
            placeholder={placeholder || 'Enter value...'}
            disabled
            className={cn(
              "w-full px-5 py-4 text-sm font-medium transition-all duration-300",
              "bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl",
              "border border-white/50 dark:border-white/10 rounded-2xl",
              "text-slate-900 dark:text-white placeholder:text-slate-400/60",
              "shadow-[0_4px_12px_rgba(0,0,0,0.03)] focus:outline-none",
              "skew-x-[-1deg]"
            )}
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none -z-10 blur-xl" />
        </div>
      </div>
    </FormFieldWrapper>
  );
};
