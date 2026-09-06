import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Package,
  Users,
  LogOut,
  X,
  Store,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../common/utils/cn';
import { useAuthStore } from '../contexts/auth/authStore';

export interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();

  const navItems = [
    {
      to: '/invoices',
      label: 'Facturas',
      icon: <FileText size={20} />,
      end: true,
    },
    {
      to: '/invoices/new',
      label: 'Nueva Factura',
      icon: <PlusCircle size={20} />,
      highlight: true,
    },
    {
      to: '/products',
      label: 'Productos y Variantes',
      icon: <Package size={20} />,
    },
    {
      to: '/customers',
      label: 'Clientes',
      icon: <Users size={20} />,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-surface-overlay backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          'relative w-72 max-w-[85vw] h-full bg-surface-card-solid border-r border-border-medium z-10 flex flex-col justify-between p-5 backdrop-blur-2xl shadow-2xl',
          'animate-in slide-in-from-left duration-300 ease-out'
        )}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary-light to-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
                <Store size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary tracking-wide leading-tight">
                  PANADERÍA
                </h2>
                <p className="text-[11px] font-medium text-brand-accent">SISTEMA POS</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-card transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* User profile snippet */}
          {user && (
            <div className="mt-4 p-3 rounded-xl bg-surface-base/60 border border-border-subtle flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary/30 border border-brand-accent/40 flex items-center justify-center text-xs font-bold text-brand-accent uppercase">
                {(user.name || user.email || user.username || 'U').charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-text-primary truncate">
                  {user.name || user.email || user.username}
                </p>
                <p className="text-[10px] text-text-muted">Cajero activo</p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 font-semibold'
                      : item.highlight
                      ? 'text-brand-accent bg-brand-accent-subtle hover:bg-brand-primary/20 border border-brand-accent/30'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-card'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={16} className="opacity-60" />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer with Logout */}
        <div className="pt-4 border-t border-border-subtle">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-status-error hover:bg-status-error/15 border border-status-error/20 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
