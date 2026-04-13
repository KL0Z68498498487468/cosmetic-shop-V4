import { FiEye, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button/index.jsx';
import Rating from '@/components/product/Rating/index.jsx';
import { useCartStore } from '@/store/cartStore.js';
import { useWishlistStore } from '@/store/wishlistStore.js';
import { formatPrice } from '@/utils/formatPrice.js';
import { cn } from '@/utils/helpers.js';

const ProductCard = ({ product, onQuickView, className }) => {
  const addItem = useCartStore((state) => state.addItem);
  const wishlistIds = useWishlistStore((state) => state.ids);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-4 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-soft',
        className
      )}
    >
      <div className="absolute inset-x-6 top-0 h-24 rounded-b-[2rem] bg-gradient-to-b from-blush/70 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={cn(
            'grid h-10 w-10 place-items-center rounded-full border bg-white/90 transition',
            isWishlisted ? 'border-accent text-accent' : 'border-line text-ink hover:border-accent'
          )}
        >
          <FiHeart className={isWishlisted ? 'fill-current' : ''} />
        </button>
        <button
          type="button"
          onClick={() => onQuickView?.(product)}
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white/90 transition hover:border-accent"
        >
          <FiEye />
        </button>
      </div>

      <Link to={`/catalog/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-[1.6rem] bg-sand">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {product.badge ? (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">
              {product.badge}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="mt-5">
        <div className="text-xs uppercase tracking-[0.22em] text-roseBrown/70">{product.brand}</div>
        <Link to={`/catalog/${product.slug}`} className="mt-2 block text-lg font-semibold text-ink">
          {product.name}
        </Link>
        <div className="mt-1 text-sm text-roseBrown/75">{product.type}</div>
        <div className="mt-3">
          <Rating value={product.rating} reviewsCount={product.reviewsCount} />
        </div>
        <div className="mt-4 flex items-end gap-2">
          <div className="text-xl font-extrabold text-ink">{formatPrice(product.price)}</div>
          {product.oldPrice ? (
            <div className="text-sm text-roseBrown/50 line-through">{formatPrice(product.oldPrice)}</div>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Button
          type="button"
          onClick={() => addItem(product, product.selectedVariant)}
          className="flex-1"
          icon={<FiShoppingBag />}
        >
          В корзину
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
