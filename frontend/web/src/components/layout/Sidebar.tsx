import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r-4 border-[#2a2a2a] min-h-screen hidden lg:block">
      <nav className="p-4 space-y-4">
        <div className="pixel-text text-[10px] text-[#888] uppercase tracking-wide px-2">
          Navigation
        </div>
        <ul className="space-y-2">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 pixel-corners border-4 transition-colors pixel-text text-[10px] uppercase tracking-wide
                    ${
                      isActive
                        ? 'bg-[#1a1a1a] border-[#4F46E5] text-white'
                        : 'bg-[#0f0f0f] border-[#2a2a2a] text-[#888] hover:border-[#4F46E5] hover:text-white'
                    }
                  `}
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

