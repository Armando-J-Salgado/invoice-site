import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Search, Plus } from 'lucide-react';
import { Modal } from '../../../common/components/Modal';
import { Input } from '../../../common/components/Input';
import { Button } from '../../../common/components/Button';
import { Spinner } from '../../../common/components/Spinner';
import { useCustomerStore } from '../../../contexts/customer/customerStore';
import type { Customer } from '../../../contexts/customer/types';
import { useToast } from '../../../common/components/Toast';

export interface CustomerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (customer: Customer) => void;
  selectedId?: number;
}

export const CustomerSelectModal: React.FC<CustomerSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedId,
}) => {
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { customers, fetchCustomers, createCustomer, isLoading } = useCustomerStore();
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      setShowCreateForm(false);
      setSearch('');
    }
  }, [isOpen, fetchCustomers]);

  const filtered = customers.filter(
    (c) =>
      !c.deletedAt &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.phoneNumber && c.phoneNumber.includes(search)) ||
        (c.email && c.email.toLowerCase().includes(search.toLowerCase())))
  );

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error('El nombre del cliente es obligatorio');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createCustomer({
        name: newName.trim(),
        phoneNumber: newPhone.trim() || undefined,
        email: newEmail.trim() || undefined,
        address: newAddress.trim() || undefined,
      });
      toast.success('Cliente creado y seleccionado');
      onSelect(created);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error al registrar cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={showCreateForm ? 'Registrar Nuevo Cliente' : 'Seleccionar Cliente'}
      subtitle={
        showCreateForm
          ? 'Complete los datos para asociar la factura'
          : 'Seleccione un cliente registrado para emitir Factura'
      }
      maxWidth="md"
    >
      {showCreateForm ? (
        <form onSubmit={handleCreateCustomer} className="flex flex-col gap-3">
          <Input
            label="Nombre Completo"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ej. Carlos Mendoza"
            required
            autoFocus
          />
          <Input
            label="Teléfono / Celular"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="Ej. 300 123 4567"
          />
          <Input
            label="Correo Electrónico"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="cliente@ejemplo.com"
          />
          <Input
            label="Dirección"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Calle 10 # 20-30"
          />

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-subtle">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCreateForm(false)}
              fullWidth
            >
              Volver a la lista
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              fullWidth
            >
              Guardar y Seleccionar
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre, celular..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={16} />}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={<Plus size={16} />}
              onClick={() => setShowCreateForm(true)}
            >
              Nuevo
            </Button>
          </div>

          {isLoading && customers.length === 0 ? (
            <div className="py-8 flex items-center justify-center text-text-muted">
              <Spinner size="md" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-text-muted flex flex-col items-center gap-2">
              <UserPlus size={32} className="opacity-40" />
              <p className="text-sm font-medium">No se encontraron clientes</p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setShowCreateForm(true)}
              >
                Crear Cliente Ahora
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
              {filtered.map((customer) => {
                const isSelected = selectedId === customer.id;
                return (
                  <div
                    key={customer.id}
                    onClick={() => {
                      onSelect(customer);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-primary/20 border-brand-accent shadow-md'
                        : 'bg-surface-base/40 border-border-subtle hover:bg-surface-card hover:border-border-medium'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {customer.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-text-secondary mt-0.5">
                        {customer.phoneNumber && <span>📞 {customer.phoneNumber}</span>}
                        {customer.email && <span>✉️ {customer.email}</span>}
                      </div>
                    </div>
                    {isSelected && (
                      <UserCheck size={18} className="text-brand-accent shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
