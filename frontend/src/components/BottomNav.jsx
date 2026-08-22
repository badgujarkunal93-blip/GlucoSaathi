import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Activity, 
  Utensils, 
  ShieldCheck, 
  LayoutDashboard, 
  BookOpen,
  Lock
} from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { unlockedStages } = useApp();

  const navItems = [
    { id: 'input', label: '01 Input', icon: Activity },
    { id: 'analysis', label: '02 AI', icon: Utensils },
    { id: 'risk', label: '03 Risk', icon: ShieldCheck },
    { id: 'dashboard', label: '04 Health', icon: LayoutDashboard },
    { id: 'journal', label: '05 Journal', icon: BookOpen },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/8 py-1.5 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isUnlocked = unlockedStages.includes(item.id);
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              disabled={!isUnlocked}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-[#075B57] font-extrabold' 
                  : isUnlocked
                    ? 'text-[#66716F]'
                    : 'text-[#66716F]/40 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#075B57]' : isUnlocked ? 'text-[#8A9694]' : 'text-[#66716F]/30'}`} />
                {!isUnlocked && (
                  <Lock className="w-2.5 h-2.5 text-[#66716F]/50 absolute -top-1 -right-1" />
                )}
              </div>
              <span className="text-[9px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
