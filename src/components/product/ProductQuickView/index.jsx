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

  // В новой базе фото лежит в main_image, описание в description_ru
  const productImage = product.main_image || product.image;
  const productDesc = product.description_ru || product.description;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
        <img
          src={productImage}
          alt={product.name}
          className="h-full min-h-80 w-full rounded-[2rem] object-cover"
        />
        <div>
          <div className="text-sm uppercase tracking-[0.24em] text-roseBrown/70 dark:text-slate-400">
            {product.brand}
          </div>
          <div className="mt-3">
            {/* Если рейтинга нет в базе, ставим 0 по дефолту */}
            <Rating value={product.rating || 5} reviewsCount={product.reviewsCount || 0} size="lg" />
          </div>
          <p className="mt-4 text-muted">{productDesc}</p>
          
          <div className="mt-5 flex flex-wrap gap-2">
            {/* ИСПРАВЛЕНО: Защита ?. и смена поля с variants на category/skin_types */}
            {product?.category?.map((item) => (
              <span key={item} className="rounded-full border border-line px-4 py-2 text-sm dark:border-slate-700 dark:text-slate-200">
                {item}
              </span>
            ))}
            {product?.skin_types?.map((item) => (
              <span key={item} className="rounded-full bg-roseBrown/5 border border-transparent px-4 py-2 text-sm dark:text-slate-200">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-end gap-3">
            <div className="text-3xl font-bold text-ink dark:text-slate-100">
              {formatPrice(product.price)}
            </div>
            {/* В новой базе может быть discount вместо oldPrice. Вычисляем если нужно: */}
            {product.discount > 0 ? (
              <div className="text-sm text-roseBrown/60 line-through dark:text-slate-500">
                {formatPrice(product.price * (1 + product.discount / 100))}
              </div>
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
