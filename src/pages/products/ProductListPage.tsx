import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Package,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useProductStore } from '../../contexts/product/productStore';
import type { Product, ProductVariant } from '../../contexts/product/types';
import { ProductModal } from './ProductModal';
import { VariantModal } from './VariantModal';
import { Button } from '../../common/components/Button';
import { Badge } from '../../common/components/Badge';
import { Spinner } from '../../common/components/Spinner';
import { SearchInput } from '../../common/components/SearchInput';
import { ConfirmDialog } from '../../common/components/ConfirmDialog';
import { formatCurrency } from '../../common/utils/currency';
import { useToast } from '../../common/components/Toast';

export const ProductListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<Record<number, boolean>>({});

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [selectedProductForVariant, setSelectedProductForVariant] = useState<Product | null>(null);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);

  // Confirm dialogs
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'product' | 'variant';
    id: number;
    name: string;
  }>({ isOpen: false, type: 'product', id: 0, name: '' });

  const {
    products,
    fetchProducts,
    deleteProduct,
    recoverProduct,
    deleteVariant,
    recoverVariant,
    isLoading,
  } = useProductStore();

  const toast = useToast();

  useEffect(() => {
    fetchProducts({ withDeleted: showDeleted });
  }, [fetchProducts, showDeleted]);

  const toggleExpand = (id: number) => {
    setExpandedProducts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesVariant = p.variants?.some((v) =>
      v.name.toLowerCase().includes(search.toLowerCase())
    );
    return matchesName || matchesVariant;
  });

  const handleDeleteConfirm = async () => {
    try {
      if (deleteDialog.type === 'product') {
        await deleteProduct(deleteDialog.id);
        toast.success(`Producto "${deleteDialog.name}" desactivado`);
      } else {
        await deleteVariant(deleteDialog.id);
        toast.success(`Variante "${deleteDialog.name}" desactivada`);
        await fetchProducts({ withDeleted: showDeleted });
      }
      setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      toast.error(err.message || 'Error al desactivar');
    }
  };

  const handleRecover = async (type: 'product' | 'variant', id: number) => {
    try {
      if (type === 'product') {
        await recoverProduct(id);
        toast.success('Producto reactivado');
      } else {
        await recoverVariant(id);
        toast.success('Variante reactivada');
      }
      await fetchProducts({ withDeleted: showDeleted });
    } catch (err: any) {
      toast.error(err.message || 'Error al reactivar');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Catálogo de Panadería</h2>
          <p className="text-xs text-text-secondary">
            Administre productos y sus variantes con precios
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
              setEditingProduct(null);
              setProductModalOpen(true);
            }}
          >
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar productos o presentaciones..."
      />

      {/* Products List */}
      {isLoading && products.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-text-muted">
          <Spinner size="lg" />
          <span className="text-sm">Cargando productos...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-card py-16 px-6 text-center flex flex-col items-center gap-4">
          <Package size={44} className="text-text-muted opacity-50" />
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              No se encontraron productos
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              {search ? 'Intente con otro término de búsqueda.' : 'Cree su primer producto para comenzar.'}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus size={16} />}
            onClick={() => {
              setEditingProduct(null);
              setProductModalOpen(true);
            }}
          >
            Crear Producto
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredProducts.map((product) => {
            const isExpanded = expandedProducts[product.id] ?? true;
            const isDeleted = !!product.deletedAt;

            return (
              <div
                key={product.id}
                className={`glass-card overflow-hidden transition-all ${
                  isDeleted ? 'border-status-error/40 bg-status-error/5 opacity-70' : ''
                }`}
              >
                {/* Product Accordion Header */}
                <div className="p-4 flex items-center justify-between gap-3 bg-surface-base/30">
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                    onClick={() => toggleExpand(product.id)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/20 text-brand-accent flex items-center justify-center border border-brand-accent/30 shrink-0">
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                          {product.name}
                        </h3>
                        {isDeleted && (
                          <Badge variant="error" size="sm">
                            Inactivo
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        {product.variants?.length || 0} presentaciones
                      </p>
                    </div>
                  </div>

                  {/* Actions on Product */}
                  <div className="flex items-center gap-1.5">
                    {isDeleted ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<RotateCcw size={14} />}
                        onClick={() => handleRecover('product', product.id)}
                      >
                        Reactivar
                      </Button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProductForVariant(product);
                            setEditingVariant(null);
                            setVariantModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-brand-primary/20 text-brand-accent hover:bg-brand-primary hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                          title="Agregar variante"
                        >
                          <Plus size={14} />
                          <span className="hidden sm:inline">Variante</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(product);
                            setProductModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-card transition-colors cursor-pointer"
                          title="Editar nombre"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteDialog({
                              isOpen: true,
                              type: 'product',
                              id: product.id,
                              name: product.name,
                            })
                          }
                          className="p-2 rounded-lg text-text-muted hover:text-status-error hover:bg-status-error/10 transition-colors cursor-pointer"
                          title="Desactivar producto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleExpand(product.id)}
                      className="p-2 rounded-lg text-text-muted hover:text-text-primary cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Variants List (Accordion Body) */}
                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-border-subtle flex flex-col gap-2">
                    {(!product.variants || product.variants.length === 0) ? (
                      <div className="py-4 text-center text-xs text-text-muted">
                        No hay variantes registradas.{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProductForVariant(product);
                            setEditingVariant(null);
                            setVariantModalOpen(true);
                          }}
                          className="text-brand-accent underline cursor-pointer"
                        >
                          Agregar la primera variante con precio
                        </button>
                      </div>
                    ) : (
                      product.variants.map((v) => {
                        const isVarDeleted = !!v.deletedAt;

                        return (
                          <div
                            key={v.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                              isVarDeleted
                                ? 'bg-status-error/5 border-status-error/30 opacity-60'
                                : 'bg-surface-base/40 border-border-subtle hover:border-border-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Layers size={14} className="text-brand-accent shrink-0" />
                              <div>
                                <span className="text-xs font-semibold text-text-primary">
                                  {v.name}
                                </span>
                                {isVarDeleted && (
                                  <span className="text-[10px] text-status-error ml-2">
                                    (Desactivada)
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-white">
                                {formatCurrency(v.price)}
                              </span>

                              {isVarDeleted ? (
                                <button
                                  type="button"
                                  onClick={() => handleRecover('variant', v.id)}
                                  className="text-xs text-brand-accent hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <RotateCcw size={12} /> Reactivar
                                </button>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedProductForVariant(product);
                                      setEditingVariant(v);
                                      setVariantModalOpen(true);
                                    }}
                                    className="p-1 rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteDialog({
                                        isOpen: true,
                                        type: 'variant',
                                        id: v.id,
                                        name: v.name,
                                      })
                                    }
                                    className="p-1 rounded text-text-muted hover:text-status-error transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Product Edit/Create Modal */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={editingProduct}
      />

      {/* Variant Edit/Create Modal */}
      <VariantModal
        isOpen={variantModalOpen}
        onClose={() => setVariantModalOpen(false)}
        product={selectedProductForVariant}
        variant={editingVariant}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleDeleteConfirm}
        title={`¿Desactivar ${deleteDialog.type === 'product' ? 'Producto' : 'Variante'}?`}
        message={`¿Está seguro de desactivar "${deleteDialog.name}"? Dejará de aparecer en la selección de nuevas facturas.`}
        confirmText="Desactivar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};
