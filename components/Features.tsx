import React from 'react';
import { MessageSquare, Lightbulb, ShieldCheck, CalendarRange } from 'lucide-react';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 lg:p-8 bg-white rounded-3xl hover:shadow-2xl transition-all border border-gray-100 group">
    <div className="flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 bg-brand-cream rounded-2xl flex items-center justify-center text-brand-burgundy group-hover:bg-brand-burgundy group-hover:text-white transition-colors">
      {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6 lg:w-8 lg:h-8" })}
    </div>
    <div>
      <h3 className="text-lg lg:text-xl font-display font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-xs lg:text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section className="relative z-20 -mt-10 md:-mt-20 pb-10 lg:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <FeatureItem 
            icon={<MessageSquare />}
            title="AI Travel Assistant"
            description="Get instant answers to any questions about Sri Lanka."
          />
          <FeatureItem 
            icon={<Lightbulb />}
            title="Local Insights"
            description="Discover hidden gems, local tips and recommendations."
          />
          <FeatureItem 
            icon={<ShieldCheck />}
            title="Travel Help"
            description="Get help with travel issues, alerts and safety information."
          />
          <FeatureItem 
            icon={<CalendarRange />}
            title="Plan Your Trip"
            description="Find places, plan your itinerary and make the most of your trip."
          />
        </div>
      </div>
    </section>
  );
};