import React, { useState } from 'react';
import { Modal } from '../../common/components/Modal';
import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';
import type { Product } from '../../contexts/product/types';
import { useProductStore } from '../../contexts/product/productStore';
import { useToast } from '../../common/components/Toast';

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProduct, updateProduct } = useProductStore();
  const toast = useToast();

  React.useEffect(() => {
    if (product) {
      setName(product.name);
    } else {
      setName('');
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre del producto es obligatorio');
      return;
    }

    setIsSubmitting(true);
    try {
      if (product) {
        await updateProduct(product.id, { name: name.trim() });
        toast.success('Producto actualizado correctamente');
      } else {
        await createProduct({ name: name.trim() });
        toast.success('Producto creado exitosamente');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar Producto' : 'Nuevo Producto'}
      subtitle="Defina la categoría o nombre base del producto"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nombre del Producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Cheesecake, Flan..."
          required
          autoFocus
        />

        <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
          <Button type="button" variant="ghost" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} fullWidth>
            {product ? 'Actualizar' : 'Guardar Producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
