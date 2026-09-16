import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  SlidersHorizontal,
  FileSpreadsheet,
  TrendingUp,
  Receipt,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useInvoiceStore } from '../../contexts/invoice/invoiceStore';
import { InvoiceCard } from './components/InvoiceCard';
import { InvoiceFilterDrawer } from './components/InvoiceFilterDrawer';
import { Button } from '../../common/components/Button';
import { Spinner } from '../../common/components/Spinner';
import { Badge } from '../../common/components/Badge';
import { formatCurrency } from '../../common/utils/currency';

export const InvoiceListPage: React.FC = () => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const { invoices, fetchInvoices, isLoading, filters, resetFilters } = useInvoiceStore();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Statistics calculation for quick dashboard overview
  const activeInvoices = invoices.filter((inv) => !inv.deleted_at);
  const totalSalesAmount = activeInvoices.reduce((acc, inv) => acc + Number(inv.total || 0), 0);
  const totalSalesCount = activeInvoices.length;

  const hasActiveFilters =
    filters.startDate ||
    filters.endDate ||
    filters.type ||
    filters.onlyDeleted ||
    filters.withDeleted;

  return (
    <div className="flex flex-col gap-5">
      {/* Top Quick Stats Carousel/Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-text-muted mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Ventas</span>
            <TrendingUp size={18} className="text-brand-accent" />
          </div>
          <p className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
            {formatCurrency(totalSalesAmount)}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-brand-accent">
            <Sparkles size={12} />
            <span>Transacciones activas</span>
          </div>
        </div>

        <div className="glass-card p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-text-muted mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Comprobantes</span>
            <Receipt size={18} className="text-brand-accent" />
          </div>
          <p className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
            {totalSalesCount}
          </p>
          <p className="mt-1 text-[11px] text-text-secondary">
            {invoices.filter((i) => i.type === 'CONTADO').length} Contado •{' '}
            {invoices.filter((i) => i.type === 'FACTURA').length} Factura
          </p>
        </div>

        <div className="glass-card p-4 col-span-2 sm:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Acción Rápida</span>
          </div>
          <Button
            size="md"
            variant="primary"
            leftIcon={<Plus size={18} />}
            onClick={() => navigate('/invoices/new')}
            fullWidth
            className="mt-2"
          >
            Registrar Factura
          </Button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-text-primary">Historial de Ventas</h2>
          {hasActiveFilters && (
            <Badge variant="warning" size="sm">
              Filtrado
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<RotateCcw size={14} />}
              onClick={resetFilters}
            >
              Restablecer
            </Button>
          )}
          <Button
            size="sm"
            variant={hasActiveFilters ? 'accent' : 'secondary'}
            leftIcon={<SlidersHorizontal size={16} />}
            onClick={() => setFilterDrawerOpen(true)}
          >
            Filtros
          </Button>
        </div>
      </div>

      {/* Invoices List */}
      {isLoading && invoices.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-text-muted">
          <Spinner size="lg" />
          <span className="text-sm">Cargando transacciones...</span>
        </div>
      ) : invoices.length === 0 ? (
        <div className="glass-card py-16 px-6 text-center flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-surface-base border border-border-subtle text-text-muted">
            <FileSpreadsheet size={40} className="opacity-60" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              No se encontraron facturas
            </h3>
            <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
              {hasActiveFilters
                ? 'No hay resultados que coincidan con los filtros seleccionados.'
                : 'Aún no se han registrado transacciones en el punto de venta.'}
            </p>
          </div>
          {hasActiveFilters ? (
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              Limpiar Filtros
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus size={18} />}
              onClick={() => navigate('/invoices/new')}
            >
              Crear Primera Venta
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}

      {/* Filter Drawer */}
      <InvoiceFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      />
    </div>
  );
};
