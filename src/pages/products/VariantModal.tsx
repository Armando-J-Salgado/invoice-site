import React, { useState } from 'react';
import { Modal } from '../../common/components/Modal';
import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';
import type { Product, ProductVariant } from '../../contexts/product/types';
import { useProductStore } from '../../contexts/product/productStore';
import { useToast } from '../../common/components/Toast';

export interface VariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  variant?: ProductVariant | null;
}

export const VariantModal: React.FC<VariantModalProps> = ({
  isOpen,
  onClose,
  product,
  variant,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createVariant, updateVariant } = useProductStore();
  const toast = useToast();

  React.useEffect(() => {
    if (variant) {
      setName(variant.name);
      setPrice(String(variant.price));
    } else {
      setName('');
      setPrice('');
    }
  }, [variant, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre de la variante es obligatorio');
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      toast.error('Ingrese un precio válido');
      return;
    }

    setIsSubmitting(true);
    try {
      if (variant) {
        await updateVariant(variant.id, {
          name: name.trim(),
          price: numPrice,
        });
        toast.success('Variante actualizada');
      } else if (product) {
        await createVariant({
          productId: product.id,
          name: name.trim(),
          price: numPrice,
        });
        toast.success('Variante agregada al producto');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar variante');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={variant ? 'Editar Variante' : `Nueva Variante para ${product?.name || ''}`}
      subtitle="Defina la presentación y el precio de venta"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Presentación / Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Unidad, Paquete x6, Porción..."
          required
          autoFocus
        />

        <Input
          label="Precio ($ USD)"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ej. 22.00"
          required
        />

        <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
          <Button type="button" variant="ghost" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} fullWidth>
            {variant ? 'Actualizar' : 'Crear Variante'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
