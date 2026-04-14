import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import Button from '@/components/common/Button/index.jsx';
import Modal from '@/components/common/Modal/index.jsx';
import Rating from '@/components/product/Rating/index.jsx';
import { useCartStore } from '@/store/cartStore.js';
import { useWishlistStore } from '@/store/wishlistStore.js';
import { formatPrice } from '@/utils/formatPrice.js';

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  if (!product) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full min-h-80 w-full rounded-[2rem] object-cover"
        />
        <div>
          <div className="text-sm uppercase tracking-[0.24em] text-roseBrown/70 dark:text-slate-400">{product.brand}</div>
          <div className="mt-3">
            <Rating value={product.rating} reviewsCount={product.reviewsCount} size="lg" />
          </div>
          <p className="mt-4 text-muted">{product.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <span key={variant} className="rounded-full border border-line px-4 py-2 text-sm dark:border-slate-700 dark:text-slate-200">
                {variant}
              </span>
            ))}
          </div>
          <div className="mt-6 flex items-end gap-3">
            <div className="text-3xl font-bold text-ink dark:text-slate-100">{formatPrice(product.price)}</div>
            {product.oldPrice ? (
              <div className="text-sm text-roseBrown/60 line-through dark:text-slate-500">{formatPrice(product.oldPrice)}</div>
            ) : null}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={() => addItem(product, product.selectedVariant)}
              className="flex-1"
              icon={<FiShoppingBag />}
            >
              В корзину
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => toggleWishlist(product.id)}
              icon={<FiHeart />}
              className="flex-1"
            >
              В избранное
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductQuickView;
