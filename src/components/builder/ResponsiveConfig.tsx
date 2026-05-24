import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';

/**
 * Global Device Selector for the Sidebar.
 * Allows users to choose which breakpoint they are currently editing.
 */
export const DeviceSelector = () => {
  const activeDevice = useUIStore(state => state.activeDevice);
  const setActiveDevice = useUIStore(state => state.setActiveDevice);
  const setPreviewMode = useUIStore(state => state.setPreviewMode);

  const devices = [
    { id: 'desktop', icon: Monitor },
    { id: 'tablet', icon: Tablet },
    { id: 'mobile', icon: Smartphone },
  ] as const;

  const handleDeviceChange = (id: 'desktop' | 'tablet' | 'mobile') => {
    setActiveDevice(id);
    setPreviewMode(id); // Sync preview mode with active device for better UX
  };

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
      {devices.map(device => (
        <button
          key={device.id}
          onClick={() => handleDeviceChange(device.id)}
          className={cn(
            "p-2 rounded-lg transition-all",
            activeDevice === device.id 
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          )}
          title={`Edit ${device.id} settings`}
        >
          <device.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};

/**
 * Responsive Label Wrapper.
 * Adds a small device indicator next to labels that support responsive values.
 */
export const ResponsiveLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const activeDevice = useUIStore(state => state.activeDevice);
  const DeviceIcon = activeDevice === 'desktop' ? Monitor : activeDevice === 'tablet' ? Tablet : Smartphone;

  return (
    <div className={cn("flex items-center justify-between group", className)}>
      <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">
        {children}
      </label>
      <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
        <DeviceIcon className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
        <span className="text-[8px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-tighter">{activeDevice}</span>
      </div>
    </div>
  );
};

/**
 * Utility to update a responsive attribute.
 */
export function updateResponsiveValue(
  currentValue: any, 
  activeDevice: 'desktop' | 'tablet' | 'mobile', 
  newValue: any
) {
  // If it's not an object yet, convert to object with current value as desktop
  let valObj = typeof currentValue === 'object' && currentValue !== null
    ? { ...currentValue } 
    : { desktop: currentValue };

  valObj[activeDevice] = newValue;
  return valObj;
}
