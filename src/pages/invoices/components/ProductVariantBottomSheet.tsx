import React, { useState, useEffect } from 'react';
import { Plus, Minus, PackageSearch } from 'lucide-react';
import { BottomSheet } from '../../../common/components/BottomSheet';
import { SearchInput } from '../../../common/components/SearchInput';
import { Badge } from '../../../common/components/Badge';
import { Spinner } from '../../../common/components/Spinner';
import { formatCurrency } from '../../../common/utils/currency';
import { useProductStore } from '../../../contexts/product/productStore';
import { useInvoiceStore } from '../../../contexts/invoice/invoiceStore';
import type { ProductVariant } from '../../../contexts/product/types';

export interface ProductVariantBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductVariantBottomSheet: React.FC<ProductVariantBottomSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const { products, fetchProducts, isLoading } = useProductStore();
  const { draftCart, addVariantToCart, updateCartQuantity } = useInvoiceStore();

  useEffect(() => {
    if (isOpen && products.length === 0) {
      fetchProducts();
    }
  }, [isOpen, products.length, fetchProducts]);

  // Filter products and their variants by search query
  const filteredProducts = products
    .map((product) => {
      const matchesProductName = product.name.toLowerCase().includes(search.toLowerCase());
      const matchingVariants = (product.variants || []).filter(
        (v) =>
          !v.deletedAt &&
          (matchesProductName || v.name.toLowerCase().includes(search.toLowerCase()))
      );

      return {
        ...product,
        variants: matchingVariants,
      };
    })
    .filter((p) => (p.variants && p.variants.length > 0) && !p.deletedAt);

  const getVariantCartQuantity = (variantId: number): number => {
    const item = draftCart.find((ci) => ci.variant.id === variantId);
    return item ? item.quantity : 0;
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Seleccionar Productos"
      subtitle="Agregue productos y cantidades al pedido"
    >
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por pan, postre, variante..."
        />

        {/* Content list */}
        {isLoading && products.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-text-muted">
            <Spinner size="lg" />
            <span className="text-xs">Cargando catálogo...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-text-muted">
            <PackageSearch size={36} className="opacity-50" />
            <p className="text-sm font-medium">No se encontraron productos</p>
            {search && (
              <p className="text-xs text-text-disabled">
                Pruebe con otro término de búsqueda
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-2xl bg-surface-card-solid/80 border border-border-subtle flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                    {product.name}
                  </h4>
                  <Badge variant="neutral" size="sm">
                    {product.variants?.length || 0} opciones
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.variants?.map((variant: ProductVariant) => {
                    const qty = getVariantCartQuantity(variant.id);
                    const isSelected = qty > 0;

                    return (
                      <div
                        key={variant.id}
                        className={`p-3 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                          isSelected
                            ? 'bg-brand-primary/15 border-brand-accent/50 shadow-sm'
                            : 'bg-surface-base/50 border-border-subtle hover:border-border-medium'
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-xs font-semibold text-text-primary truncate">
                            {variant.name}
                          </p>
                          <p className="text-xs font-bold text-brand-accent mt-0.5">
                            {formatCurrency(variant.price)}
                          </p>
                        </div>

                        {isSelected ? (
                          <div className="flex items-center gap-1.5 bg-surface-card-solid px-1.5 py-1 rounded-lg border border-brand-accent/30">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(variant.id, qty - 1)}
                              className="w-7 h-7 rounded-md bg-surface-base hover:bg-status-error/20 hover:text-status-error flex items-center justify-center text-text-secondary transition-colors cursor-pointer"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-xs font-bold text-text-primary px-1 min-w-[18px] text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(variant.id, qty + 1)}
                              className="w-7 h-7 rounded-md bg-brand-primary hover:bg-brand-primary-light text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addVariantToCart(variant, 1)}
                            className="px-3 py-1.5 rounded-lg bg-brand-primary/20 hover:bg-brand-primary text-brand-accent hover:text-white border border-brand-accent/30 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Plus size={14} />
                            <span>Agregar</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BottomSheet>
  );
};
