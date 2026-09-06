import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Users,
  Phone,
  Mail,
  MapPin,
  Heart,
} from 'lucide-react';
import { useCustomerStore } from '../../contexts/customer/customerStore';
import type { Customer } from '../../contexts/customer/types';
import { CustomerModal } from './CustomerModal';
import { Button } from '../../common/components/Button';
import { Badge } from '../../common/components/Badge';
import { Spinner } from '../../common/components/Spinner';
import { SearchInput } from '../../common/components/SearchInput';
import { ConfirmDialog } from '../../common/components/ConfirmDialog';
import { useToast } from '../../common/components/Toast';

export const CustomerListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    customer: Customer | null;
  }>({ isOpen: false, customer: null });

  const {
    customers,
    fetchCustomers,
    deleteCustomer,
    recoverCustomer,
    isLoading,
  } = useCustomerStore();

  const toast = useToast();

  useEffect(() => {
    fetchCustomers({ withDeleted: showDeleted });
  }, [fetchCustomers, showDeleted]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phoneNumber && c.phoneNumber.includes(search)) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.customer) return;
    try {
      await deleteCustomer(deleteDialog.customer.id);
      toast.success(`Cliente "${deleteDialog.customer.name}" desactivado`);
      setDeleteDialog({ isOpen: false, customer: null });
    } catch (err: any) {
      toast.error(err.message || 'Error al desactivar cliente');
    }
  };

  const handleRecover = async (id: number) => {
    try {
      await recoverCustomer(id);
      toast.success('Cliente reactivado correctamente');
      await fetchCustomers({ withDeleted: showDeleted });
    } catch (err: any) {
      toast.error(err.message || 'Error al reactivar cliente');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Directorio de Clientes</h2>
          <p className="text-xs text-text-secondary">
            Administre datos de contacto y preferencias de sus clientes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showDeleted ? 'accent' : 'secondary'}
            size="sm"
            onClick={() => setShowDeleted(!showDeleted)}
          >
            {showDeleted ? 'Ocultar Inactivos' : 'Ver Inactivos'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => {
              setEditingCustomer(null);
              setCustomerModalOpen(true);
            }}
          >
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre, teléfono, correo..."
      />

      {/* Customers List */}
      {isLoading && customers.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-text-muted">
          <Spinner size="lg" />
          <span className="text-sm">Cargando clientes...</span>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="glass-card py-16 px-6 text-center flex flex-col items-center gap-4">
          <Users size={44} className="text-text-muted opacity-50" />
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              No se encontraron clientes
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              {search ? 'Intente con otro término de búsqueda.' : 'Registre su primer cliente para facturar.'}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus size={16} />}
            onClick={() => {
              setEditingCustomer(null);
              setCustomerModalOpen(true);
            }}
          >
            Registrar Cliente
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredCustomers.map((customer) => {
            const isDeleted = !!customer.deletedAt;

            return (
              <div
                key={customer.id}
                className={`glass-card p-4 flex flex-col justify-between gap-4 transition-all ${
                  isDeleted ? 'border-status-error/40 bg-status-error/5 opacity-70' : ''
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-accent flex items-center justify-center text-xs font-bold border border-brand-accent/30">
                        {customer.name.charAt(0)}
                      </div>
                      <h3 className="text-sm font-bold text-text-primary truncate max-w-[180px]">
                        {customer.name}
                      </h3>
                    </div>

                    {isDeleted && (
                      <Badge variant="error" size="sm">
                        Inactivo
                      </Badge>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-col gap-1.5 text-xs text-text-secondary pl-1">
                    {customer.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-text-muted shrink-0" />
                        <span>{customer.phoneNumber}</span>
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={13} className="text-text-muted shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-text-muted shrink-0" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    )}
                    {customer.favoriteProduct && (
                      <div className="flex items-center gap-2 text-brand-accent font-medium mt-1">
                        <Heart size={13} className="shrink-0" />
                        <span>Favorito: {customer.favoriteProduct.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-end gap-1 pt-2 border-t border-border-subtle">
                  {isDeleted ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<RotateCcw size={14} />}
                      onClick={() => handleRecover(customer.id)}
                    >
                      Reactivar
                    </Button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCustomer(customer);
                          setCustomerModalOpen(true);
                        }}
                        className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-card transition-colors cursor-pointer"
                        title="Editar cliente"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteDialog({
                            isOpen: true,
                            customer,
                          })
                        }
                        className="p-2 rounded-lg text-text-muted hover:text-status-error hover:bg-status-error/10 transition-colors cursor-pointer"
                        title="Desactivar cliente"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer Modal */}
      <CustomerModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        customer={editingCustomer}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, customer: null })}
        onConfirm={handleDeleteConfirm}
        title="¿Desactivar Cliente?"
        message={`¿Está seguro de desactivar a "${deleteDialog.customer?.name}"?`}
        confirmText="Desactivar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};
