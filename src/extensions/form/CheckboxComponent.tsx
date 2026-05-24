import React from 'react';
import { cn } from '../../lib/utils';
import { FormFieldWrapper } from './FormFieldWrapper';
import { Check } from 'lucide-react';

export const CheckboxComponent = (props: any) => {
  const { node } = props;
  const { label, required, name } = node.attrs;

  return (
    <FormFieldWrapper {...props} label="CHECKBOX" type="Checkbox">
      <div className="flex items-center gap-4 text-left group/check-wrap">
        <div className={cn(
          "relative w-6 h-6 flex items-center justify-center transition-all duration-300",
          "bg-white/60 dark:bg-slate-900/40 backdrop-blur-md",
          "border border-white/50 dark:border-white/10 rounded-lg",
          "shadow-sm skew-x-[-2deg]",
          "group-hover/check-wrap:border-indigo-500/50 group-hover/check-wrap:shadow-md"
        )}>
          <Check className="w-4 h-4 text-indigo-500 opacity-20" />
        </div>
        {label && (
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-default tracking-tight">
            {label} {required && <span className="text-rose-500 font-bold">*</span>}
          </label>
        )}
      </div>
    </FormFieldWrapper>
  );
};
