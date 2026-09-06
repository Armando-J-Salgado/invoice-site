import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Banknote,
  Smartphone,
  CreditCard,
  Plus,
  Trash2,
  User,
  ShoppingBag,
  CheckCircle2,
  PlusCircle,
  X,
} from 'lucide-react';
import { useInvoiceStore } from '../../contexts/invoice/invoiceStore';
import type { PaymentMethod } from '../../contexts/invoice/types';
import { ProductVariantBottomSheet } from './components/ProductVariantBottomSheet';
import { CustomerSelectModal } from './components/CustomerSelectModal';
import { Button } from '../../common/components/Button';
import { Badge } from '../../common/components/Badge';
import { formatCurrency } from '../../common/utils/currency';
import { useToast } from '../../common/components/Toast';

export const InvoiceCreatePage: React.FC = () => {
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    draftType,
    setDraftType,
    draftPaymentMethod,
    setDraftPaymentMethod,
    draftCustomer,
    setDraftCustomer,
    draftCart,
    updateCartQuantity,
    removeCartItem,
    clearDraft,
    createInvoice,
  } = useInvoiceStore();

  const navigate = useNavigate();
  const toast = useToast();

  const paymentMethods: { method: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { method: 'CASH', label: 'Efectivo', icon: <Banknote size={20} /> },
    { method: 'NEQUI', label: 'Nequi', icon: <Smartphone size={20} /> },
    { method: 'TRANSFER', label: 'Transferencia', icon: <CreditCard size={20} /> },
  ];

  // Calculate live estimated total for client responsiveness
  const totalEstimated = draftCart.reduce(
    (acc, item) => acc + Number(item.variant.price) * item.quantity,
    0
  );

  const handleSubmit = async () => {
    if (draftCart.length === 0) {
      toast.error('Debe agregar al menos un producto a la factura');
      setIsProductSheetOpen(true);
      return;
    }

    if (draftType === 'FACTURA' && !draftCustomer) {
      toast.error('Debe seleccionar o registrar un cliente para Factura');
      setIsCustomerModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createInvoice();
      toast.success(`¡Factura #${created.id} registrada exitosamente!`);
      navigate(`/invoices/${created.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Error al registrar la factura');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-28">
      {/* Step 1: Invoice Type Toggle */}
      <div className="glass-card p-4">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2.5">
          Tipo de Comprobante
        </label>
        <div className="grid grid-cols-2 gap-2 bg-surface-base/80 p-1.5 rounded-2xl border border-border-subtle">
          <button
            type="button"
            onClick={() => setDraftType('CONTADO')}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              draftType === 'CONTADO'
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 border border-brand-accent/40'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-card'
            }`}
          >
            <span>Venta Contado</span>
            <Badge variant="contado" size="sm">
              Rápida
            </Badge>
          </button>
          <button
            type="button"
            onClick={() => setDraftType('FACTURA')}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              draftType === 'FACTURA'
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 border border-brand-accent/40'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-card'
            }`}
          >
            <span>Factura</span>
            <Badge variant="factura" size="sm">
              Con Cliente
            </Badge>
          </button>
        </div>
      </div>

      {/* Step 2: Payment Method Selector */}
      <div className="glass-card p-4">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2.5">
          Método de Pago
        </label>
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map(({ method, label, icon }) => {
            const isSelected = draftPaymentMethod === method;
            return (
              <button
                key={method}
                type="button"
                onClick={() => setDraftPaymentMethod(method)}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-primary/25 border-brand-accent text-white shadow-md'
                    : 'bg-surface-base/40 border-border-subtle text-text-secondary hover:bg-surface-card hover:text-text-primary'
                }`}
              >
                <div className={isSelected ? 'text-brand-accent' : 'text-text-muted'}>
                  {icon}
                </div>
                <span className="text-xs font-semibold">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Customer Selector (Required for FACTURA, optional for CONTADO) */}
      {(draftType === 'FACTURA' || draftCustomer) && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <span>Cliente Asociado</span>
              {draftType === 'FACTURA' && (
                <span className="text-status-error text-sm font-bold">*</span>
              )}
            </label>
            {draftCustomer && (
              <button
                type="button"
                onClick={() => setDraftCustomer(null)}
                className="text-xs text-status-error hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X size={12} /> Quitar
              </button>
            )}
          </div>

          {draftCustomer ? (
            <div className="p-3 rounded-2xl bg-surface-base/60 border border-brand-accent/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-primary/30 text-brand-accent flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    {draftCustomer.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {draftCustomer.phoneNumber || draftCustomer.email || 'Sin contacto'}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCustomerModalOpen(true)}
              >
                Cambiar
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCustomerModalOpen(true)}
              className="w-full p-4 rounded-2xl border-2 border-dashed border-border-medium hover:border-brand-accent/60 bg-surface-base/30 text-text-secondary hover:text-text-primary flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <User size={18} className="text-brand-accent" />
              <span className="text-sm font-semibold">Seleccionar o Crear Cliente</span>
            </button>
          )}
        </div>
      )}

      {/* Step 4: Product Cart */}
      <div className="glass-card p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-brand-accent" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Productos en la Orden ({draftCart.reduce((a, b) => a + b.quantity, 0)})
            </h3>
          </div>
          <Button
            size="sm"
            variant="accent"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsProductSheetOpen(true)}
          >
            Agregar Productos
          </Button>
        </div>

        {draftCart.length === 0 ? (
          <div
            onClick={() => setIsProductSheetOpen(true)}
            className="py-10 border-2 border-dashed border-border-subtle hover:border-brand-accent/50 rounded-2xl flex flex-col items-center justify-center gap-2 text-text-muted cursor-pointer transition-colors bg-surface-base/20"
          >
            <PlusCircle size={36} className="text-brand-accent opacity-60" />
            <p className="text-sm font-semibold text-text-primary">
              Ningún producto agregado
            </p>
            <p className="text-xs text-text-secondary">
              Toque aquí para abrir el catálogo y seleccionar panes o pasteles
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {draftCart.map((item) => (
              <div
                key={item.variant.id}
                className="p-3.5 rounded-2xl bg-surface-base/50 border border-border-subtle flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-text-primary truncate">
                    {item.variant.name}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {formatCurrency(item.variant.price)} c/u
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-surface-card-solid rounded-xl border border-border-medium px-1.5 py-1">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.variant.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-surface-base hover:bg-surface-card text-text-primary flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-text-primary">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.variant.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-brand-primary text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <p className="text-xs font-extrabold text-brand-accent">
                      {formatCurrency(Number(item.variant.price) * item.quantity)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCartItem(item.variant.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-status-error hover:bg-status-error/10 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Clear cart action */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={clearDraft}
                className="text-xs text-text-muted hover:text-status-error transition-colors cursor-pointer"
              >
                Vaciar orden
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-surface-card-solid/90 backdrop-blur-2xl border-t border-border-medium shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
              Total a Registrar
            </span>
            <p className="text-xl sm:text-2xl font-black text-white leading-none mt-0.5">
              {formatCurrency(totalEstimated)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => navigate('/invoices')}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              leftIcon={<CheckCircle2 size={20} />}
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="px-6 shadow-xl shadow-brand-primary/40"
            >
              Registrar Venta
            </Button>
          </div>
        </div>
      </div>

      {/* Product Selector Sheet */}
      <ProductVariantBottomSheet
        isOpen={isProductSheetOpen}
        onClose={() => setIsProductSheetOpen(false)}
      />

      {/* Customer Selector Modal */}
      <CustomerSelectModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSelect={(cust) => setDraftCustomer(cust)}
        selectedId={draftCustomer?.id}
      />
    </div>
  );
};
