import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Utensils, 
  ShieldCheck, 
  LayoutDashboard, 
  BookOpen
} from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'meal', label: 'Meal', icon: Utensils },
    { id: 'risk', label: 'Risk', icon: ShieldCheck },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'journal', label: 'Journal', icon: BookOpen },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/8 py-1.5 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                isActive ? 'text-[#075B57] font-extrabold' : 'text-[#66716F]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#075B57]' : 'text-[#8A9694]'}`} />
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
