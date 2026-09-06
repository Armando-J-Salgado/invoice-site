import React from 'react';
import { RotateCcw } from 'lucide-react';
import { BottomSheet } from '../../../common/components/BottomSheet';
import { Button } from '../../../common/components/Button';
import { Select } from '../../../common/components/Select';
import { Input } from '../../../common/components/Input';
import { useInvoiceStore } from '../../../contexts/invoice/invoiceStore';
import type { InvoiceType } from '../../../contexts/invoice/types';

export interface InvoiceFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceFilterDrawer: React.FC<InvoiceFilterDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { filters, setFilters, resetFilters } = useInvoiceStore();

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as InvoiceType | '';
    setFilters({ type: val ? val : undefined });
  };

  const handleDeletedToggle = (deletedMode: 'active' | 'withDeleted' | 'onlyDeleted') => {
    if (deletedMode === 'active') {
      setFilters({ onlyDeleted: false, withDeleted: false });
    } else if (deletedMode === 'withDeleted') {
      setFilters({ onlyDeleted: false, withDeleted: true });
    } else if (deletedMode === 'onlyDeleted') {
      setFilters({ onlyDeleted: true, withDeleted: false });
    }
  };

  const currentDeletedMode = filters.onlyDeleted
    ? 'onlyDeleted'
    : filters.withDeleted
    ? 'withDeleted'
    : 'active';

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros de Facturas"
      subtitle="Refine la búsqueda de transacciones"
    >
      <div className="flex flex-col gap-4 pb-6">
        {/* Date Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="date"
            label="Fecha Inicial"
            value={filters.startDate ? filters.startDate.split('T')[0] : ''}
            onChange={(e) =>
              setFilters({
                startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
              })
            }
          />
          <Input
            type="date"
            label="Fecha Final"
            value={filters.endDate ? filters.endDate.split('T')[0] : ''}
            onChange={(e) =>
              setFilters({
                endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
              })
            }
          />
        </div>

        {/* Invoice Type */}
        <Select
          label="Tipo de Comprobante"
          value={filters.type || ''}
          onChange={handleTypeChange}
          options={[
            { value: '', label: 'Todos los tipos (Contado y Factura)' },
            { value: 'CONTADO', label: 'Solo Ventas de Contado' },
            { value: 'FACTURA', label: 'Solo Facturas con Cliente' },
          ]}
        />

        {/* Deleted / Active Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary">
            Estado de Anulación
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDeletedToggle('active')}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                currentDeletedMode === 'active'
                  ? 'bg-brand-primary text-white border-brand-accent'
                  : 'bg-surface-base/50 text-text-secondary border-border-subtle hover:bg-surface-card'
              }`}
            >
              Activas
            </button>
            <button
              type="button"
              onClick={() => handleDeletedToggle('withDeleted')}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                currentDeletedMode === 'withDeleted'
                  ? 'bg-brand-primary text-white border-brand-accent'
                  : 'bg-surface-base/50 text-text-secondary border-border-subtle hover:bg-surface-card'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => handleDeletedToggle('onlyDeleted')}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                currentDeletedMode === 'onlyDeleted'
                  ? 'bg-status-error/30 text-status-error border-status-error'
                  : 'bg-surface-base/50 text-text-secondary border-border-subtle hover:bg-surface-card'
              }`}
            >
              Anuladas
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border-subtle">
          <Button
            type="button"
            variant="ghost"
            leftIcon={<RotateCcw size={16} />}
            onClick={() => {
              resetFilters();
              onClose();
            }}
            fullWidth
          >
            Limpiar Filtros
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onClose}
            fullWidth
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};
