import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  User,
  ShoppingBag,
  CreditCard,
  Ban,
  RotateCcw,
  Plus,
  ArrowLeft,
  Store,
  CheckCircle,
} from 'lucide-react';
import { useInvoiceStore } from '../../contexts/invoice/invoiceStore';
import type { Invoice } from '../../contexts/invoice/types';
import { Button } from '../../common/components/Button';
import { Badge } from '../../common/components/Badge';
import { Spinner } from '../../common/components/Spinner';
import { ConfirmDialog } from '../../common/components/ConfirmDialog';
import { formatCurrency } from '../../common/utils/currency';
import { formatDate } from '../../common/utils/date';
import { useToast } from '../../common/components/Toast';

export const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { fetchInvoiceById, deleteInvoice, recoverInvoice, isLoading } = useInvoiceStore();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRecoverDialogOpen, setIsRecoverDialogOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const hasFetchedInvoice = useRef(false);

useEffect(() => {
  if (!id || hasFetchedInvoice.current) return;

  hasFetchedInvoice.current = true;

  fetchInvoiceById(Number(id))
    .then(setInvoice)
    .catch((err) => {
      toast.error(err.message || 'No se pudo cargar la factura');
      navigate('/invoices');
    });
}, [id, fetchInvoiceById, navigate]);

  if (isLoading || !invoice) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-text-muted">
        <Spinner size="lg" />
        <span className="text-sm">Cargando detalles del comprobante...</span>
      </div>
    );
  }

  const isDeleted = !!(invoice.deletedAt || invoice.deleted_at);
  const invoiceDate = invoice.createdAt || invoice.created_at || invoice.date;
  const deletedDate = invoice.deletedAt || invoice.deleted_at;

  const paymentMethodLabel = {
    CASH: 'Efectivo',
    NEQUI: 'Nequi',
    TRANSFER: 'Transferencia Bancaria',
  }[invoice.paymentMethod] || invoice.paymentMethod;

  const handleDeactivate = async () => {
    setIsActionLoading(true);
    try {
      await deleteInvoice(invoice.id);
      toast.success('Factura anulada correctamente');
      const updated = await fetchInvoiceById(invoice.id);
      setInvoice(updated);
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Error al anular factura');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRecover = async () => {
    setIsActionLoading(true);
    try {
      await recoverInvoice(invoice.id);
      toast.success('Factura reactivada con éxito');
      const updated = await fetchInvoiceById(invoice.id);
      setInvoice(updated);
      setIsRecoverDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Error al reactivar factura');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto pb-12">
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/invoices')}
        >
          Volver a Facturas
        </Button>

        <div className="flex items-center gap-2">
          {isDeleted ? (
            <Button
              variant="accent"
              size="sm"
              leftIcon={<RotateCcw size={16} />}
              onClick={() => setIsRecoverDialogOpen(true)}
            >
              Reactivar Factura
            </Button>
          ) : (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Ban size={16} />}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Anular Factura
            </Button>
          )}
        </div>
      </div>

      {/* Main Invoice Voucher Card */}
      <div
        className={`glass-card p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden ${
          isDeleted ? 'border-status-error/40 bg-status-error/5' : ''
        }`}
      >
        {/* Deleted Banner */}
        {isDeleted && (
          <div className="p-3.5 rounded-2xl bg-status-error/15 border border-status-error/30 text-status-error flex items-center gap-3">
            <Ban size={20} className="shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Comprobante Anulado
              </p>
              <p className="text-xs text-status-error/80 mt-0.5">
                Esta factura fue desactivada el {formatDate(deletedDate ? String(deletedDate) : null)}
              </p>
            </div>
          </div>
        )}

        {/* Voucher Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 text-brand-accent flex items-center justify-center border border-brand-accent/30">
              <Store size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white font-mono">
                  Factura #{invoice.id.toString().padStart(4, '0')}
                </h2>
                <Badge variant={invoice.type === 'CONTADO' ? 'contado' : 'factura'}>
                  {invoice.type}
                </Badge>
              </div>
              <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(invoiceDate ? String(invoiceDate) : null)}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end">
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              Método de Pago
            </span>
            <div className="flex items-center gap-2 mt-1">
              <CreditCard size={16} className="text-brand-accent" />
              <span className="text-sm font-bold text-text-primary">
                {paymentMethodLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information (if present) */}
        {invoice.customer && (
          <div className="p-4 rounded-2xl bg-surface-base/60 border border-border-subtle flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-accent uppercase tracking-wider">
              <User size={14} />
              <span>Datos del Cliente</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-text-muted">Nombre: </span>
                <span className="font-semibold text-text-primary">
                  {invoice.customer.name}
                </span>
              </div>
              {invoice.customer.phoneNumber && (
                <div>
                  <span className="text-text-muted">Teléfono: </span>
                  <span className="font-semibold text-text-primary">
                    {invoice.customer.phoneNumber}
                  </span>
                </div>
              )}
              {invoice.customer.email && (
                <div>
                  <span className="text-text-muted">Email: </span>
                  <span className="font-semibold text-text-primary">
                    {invoice.customer.email}
                  </span>
                </div>
              )}
              {invoice.customer.address && (
                <div>
                  <span className="text-text-muted">Dirección: </span>
                  <span className="font-semibold text-text-primary">
                    {invoice.customer.address}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Itemized Sale List */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-wider">
            <ShoppingBag size={14} />
            <span>Detalle de Productos ({invoice.sales?.length || 0})</span>
          </div>

          <div className="flex flex-col gap-2">
            {invoice.sales?.map((sale, idx) => {
              const unitPrice = sale.unitPrice || sale.productVariant?.price || 0;
              const subtotal =
                sale.totalPrice || Number(unitPrice) * sale.quantity;

              return (
                <div
                  key={sale.id || idx}
                  className="p-3.5 rounded-2xl bg-surface-base/40 border border-border-subtle flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary truncate">
                      {sale.productVariant?.name || `Variante #${sale.productVariantId}`}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {sale.quantity} x {formatCurrency(unitPrice)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-extrabold text-white">
                      {formatCurrency(subtotal)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grand Total Footer */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-text-muted tracking-wider">
              Total Liquidado
            </span>
            <p className="text-xs text-brand-accent flex items-center gap-1 mt-0.5">
              <CheckCircle size={12} />
              Calculado por el servidor
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="primary"
          leftIcon={<Plus size={18} />}
          onClick={() => navigate('/invoices/new')}
        >
          Crear Nueva Venta
        </Button>
      </div>

      {/* Deactivation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeactivate}
        title="¿Anular esta Factura?"
        message={`¿Está seguro de desactivar la factura #${invoice.id}? El registro pasará al estado anulado pero podrá recuperarse posteriormente.`}
        confirmText="Sí, Anular Factura"
        cancelText="Volver"
        variant="danger"
        isLoading={isActionLoading}
      />

      {/* Recovery Dialog */}
      <ConfirmDialog
        isOpen={isRecoverDialogOpen}
        onClose={() => setIsRecoverDialogOpen(false)}
        onConfirm={handleRecover}
        title="¿Reactivar Factura?"
        message={`¿Desea restaurar la factura #${invoice.id}? Volverá a estar activa y reflejada en el total de ventas.`}
        confirmText="Sí, Reactivar"
        cancelText="Cancelar"
        variant="info"
        isLoading={isActionLoading}
      />
    </div>
  );
};
