import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title: string;
  defaultCollapsed?: boolean;
  className?: string;
}

export function ResponsiveLayout({ 
  children, 
  title, 
  defaultCollapsed = false, 
  className = '' 
}: ResponsiveLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Mobile-friendly collapsible header */}
      <div className="md:hidden">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
          aria-label={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
        >
          <h3 className="font-semibold">{title}</h3>
          {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
        
        {!isCollapsed && (
          <div className="px-4 pb-4">
            {children}
          </div>
        )}
      </div>

      {/* Desktop layout - always visible */}
      <div className="hidden md:block p-4">
        <h3 className="font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

interface MobileTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }>;
  className?: string;
}

export function MobileTabs({ tabs, className = '' }: MobileTabsProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id);

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Tab Navigation */}
      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}