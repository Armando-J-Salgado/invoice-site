import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, User, ShoppingBag, Ban } from 'lucide-react';
import type { Invoice } from '../../../contexts/invoice/types';
import { Badge } from '../../../common/components/Badge';
import { formatCurrency } from '../../../common/utils/currency';
import { formatDate } from '../../../common/utils/date';

export interface InvoiceCardProps {
  invoice: Invoice;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  const navigate = useNavigate();
  const isDeleted = !!(invoice.deletedAt || invoice.deleted_at);

  const paymentMethodLabel = {
    CASH: 'Efectivo',
    NEQUI: 'Nequi',
    TRANSFER: 'Transferencia',
  }[invoice.paymentMethod] || invoice.paymentMethod;

  const paymentVariant = {
    CASH: 'cash',
    NEQUI: 'nequi',
    TRANSFER: 'transfer',
  }[invoice.paymentMethod] as any;

  const typeVariant = invoice.type === 'CONTADO' ? 'contado' : 'factura';

  const totalItems = invoice.sales?.reduce((acc, s) => acc + s.quantity, 0) || 0;
  const invoiceDate = invoice.createdAt || invoice.created_at || invoice.date;

  return (
    <div
      onClick={() => navigate(`/invoices/${invoice.id}`)}
      className={`glass-card p-4 transition-all duration-200 cursor-pointer relative overflow-hidden ${
        isDeleted
          ? 'opacity-65 border-status-error/40 bg-status-error/5'
          : 'hover:border-border-strong hover:scale-[1.01] hover:shadow-xl'
      }`}
    >
      {/* Top Header info */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-brand-accent tracking-wider font-mono">
            #{invoice.id.toString().padStart(4, '0')}
          </span>
          <Badge variant={typeVariant} size="sm">
            {invoice.type}
          </Badge>
          <Badge variant={paymentVariant} size="sm">
            {paymentMethodLabel}
          </Badge>
        </div>

        {isDeleted && (
          <Badge variant="error" size="sm" className="gap-1">
            <Ban size={12} />
            Anulada
          </Badge>
        )}
      </div>

      {/* Main Content Info */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1 text-xs text-text-secondary">
          <div className="flex items-center gap-1.5 text-text-primary font-medium">
            <User size={14} className="text-brand-accent shrink-0" />
            <span className="truncate max-w-[180px] sm:max-w-xs">
              {invoice.customer?.name || (invoice.type === 'CONTADO' ? 'Cliente General' : 'Sin cliente')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-text-muted text-[11px]">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(invoiceDate ? String(invoiceDate) : null, 'dd/MM/yyyy hh:mm a')}
            </span>
            <span className="flex items-center gap-1">
              <ShoppingBag size={12} />
              {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
            </span>
          </div>
        </div>

        {/* Total Price & Arrow */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Total</p>
            <p className="text-base sm:text-lg font-extrabold text-white">
              {formatCurrency(invoice.total)}
            </p>
          </div>
          <div className="p-1 rounded-lg bg-surface-base text-text-muted">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
