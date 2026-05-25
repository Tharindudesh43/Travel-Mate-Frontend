import React from 'react';
import { cn } from '@/lib/utils';
import ChatIcon from '@/assests/input_file_2.png';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, showText = true }) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative w-12 h-12 flex-shrink-0">
        <img 
          src={ChatIcon.src} 
          alt="TravelMate Logo" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
      
      {showText && (
        <span className="font-display text-2xl font-bold tracking-tight text-brand-burgundy flex items-center">
          Travel<span className="text-brand-gold">Mate</span>
        </span>
      )}
    </div>
  );
};
