import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/components/Modal';
import { Input } from '../../common/components/Input';
import { Select } from '../../common/components/Select';
import { Button } from '../../common/components/Button';
import type { Customer } from '../../contexts/customer/types';
import { useCustomerStore } from '../../contexts/customer/customerStore';
import { useProductStore } from '../../contexts/product/productStore';
import { useToast } from '../../common/components/Toast';

export interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [favoriteProductId, setFavoriteProductId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createCustomer, updateCustomer } = useCustomerStore();
  const { variants, fetchVariants } = useProductStore();
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchVariants();
      if (customer) {
        setName(customer.name);
        setPhone(customer.phoneNumber || '');
        setEmail(customer.email || '');
        setAddress(customer.address || '');
        setFavoriteProductId(customer.favoriteProductId ? String(customer.favoriteProductId) : '');
      } else {
        setName('');
        setPhone('');
        setEmail('');
        setAddress('');
        setFavoriteProductId('');
      }
    }
  }, [customer, isOpen, fetchVariants]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre del cliente es obligatorio');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: name.trim(),
      phoneNumber: phone.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      favoriteProductId: favoriteProductId ? Number(favoriteProductId) : undefined,
    };

    try {
      if (customer) {
        await updateCustomer(customer.id, payload);
        toast.success('Cliente actualizado correctamente');
      } else {
        await createCustomer(payload);
        toast.success('Cliente registrado exitosamente');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const variantOptions = [
    { value: '', label: 'Ninguno (Sin preferencia)' },
    ...variants.map((v) => ({
      value: v.id,
      label: `${v.name} (${v.product?.name || 'Panadería'})`,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? 'Editar Cliente' : 'Nuevo Cliente'}
      subtitle="Datos del cliente para emisión de facturas"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nombre Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Ana Lucía Gómez"
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Teléfono / Celular"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej. 310 987 6543"
          />
          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ana@ejemplo.com"
          />
        </div>

        <Input
          label="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Carrera 45 # 12-34"
        />

        <Select
          label="Producto Favorito / Preferido"
          value={favoriteProductId}
          onChange={(e) => setFavoriteProductId(e.target.value)}
          options={variantOptions}
        />

        <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
          <Button type="button" variant="ghost" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} fullWidth>
            {customer ? 'Actualizar' : 'Guardar Cliente'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
