import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Plus, ArrowLeft } from 'lucide-react';
import { SideDrawer } from './SideDrawer';
import { Button } from '../common/components/Button';

export const AppShell: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isNewInvoicePage = location.pathname === '/invoices/new';
  const isDetailPage = location.pathname.startsWith('/invoices/') && !isNewInvoicePage;

  const getPageTitle = () => {
    if (location.pathname === '/invoices') return 'Facturas';
    if (location.pathname === '/invoices/new') return 'Nueva Factura';
    if (location.pathname === '/products') return 'Productos';
    if (location.pathname === '/customers') return 'Clientes';
    if (isDetailPage) return 'Detalle de Factura';
    return 'Panadería';
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-text-primary">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 glass-card !rounded-none !border-x-0 !border-t-0 px-4 py-3 sm:px-6 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {isDetailPage || isNewInvoicePage ? (
            <button
              onClick={() => navigate('/invoices')}
              className="p-2 rounded-xl bg-surface-card hover:bg-surface-base border border-border-subtle text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-xl bg-surface-card hover:bg-surface-base border border-border-subtle text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
          )}

          <div>
            <h1 className="text-base sm:text-lg font-bold text-text-primary leading-tight">
              {getPageTitle()}
            </h1>
            <p className="text-[11px] text-text-muted hidden sm:block">
              Panadería & Pastelería Artesanal
            </p>
          </div>
        </div>

        {/* Quick New Invoice Action Button (hidden when already on new invoice page) */}
        {!isNewInvoicePage && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => navigate('/invoices/new')}
            className="shadow-md"
          >
            Nueva Venta
          </Button>
        )}
      </header>

      {/* Side Navigation Drawer */}
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-20">
        <Outlet />
      </main>
    </div>
  );
};
