import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { SwiperSlide } from 'swiper/react';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import Button from '@/components/common/Button/index.jsx';
import Rating from '@/components/product/Rating/index.jsx';
import ProductCard from '@/components/product/ProductCard/index.jsx';
import Carousel from '@/components/ui/Carousel/index.jsx';
import SectionHeading from '@/components/ui/SectionHeading/index.jsx';
import { fetchProductBySlug, fetchProducts, submitReview } from '@/services/api.js';
import { queryKeys } from '@/services/queryKeys.js';
import { useCartStore } from '@/store/cartStore.js';
import { useWishlistStore } from '@/store/wishlistStore.js';
import { formatPrice } from '@/utils/formatPrice.js';

const ProductPage = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const wishlistIds = useWishlistStore((state) => state.ids);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const { data: product } = useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => fetchProductBySlug(slug)
  });
  const { data: products = [] } = useQuery({
    queryKey: queryKeys.products,
    queryFn: fetchProducts
  });
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { author: '', rating: 5, text: '' }
  });

  const mutation = useMutation({
    mutationFn: (review) => submitReview({ productId: product.id, review }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.product(slug) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.products });
      reset();
    }
  });

  const relatedProducts = useMemo(
    () => products.filter((item) => product?.relatedIds.includes(item.id)),
    [product, products]
  );

  const bundleProducts = useMemo(
    () => products.filter((item) => product?.bundleIds.includes(item.id)),
    [product, products]
  );

  if (!product) {
    return null;
  }

  const currentVariant = selectedVariant || product.selectedVariant;
  const currentImage = activeImage || product.gallery[0];

  return (
    <>
      <Seo title={`${product.name} | Lumina`} description={product.description} image={product.image} />
      <div className="container-shell py-8">
        <Breadcrumbs
          items={[
            { label: 'Главная', to: '/' },
            { label: 'Каталог', to: '/catalog' },
            { label: product.name }
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="overflow-hidden rounded-[2.5rem] bg-white p-4 shadow-soft">
              <img src={currentImage} alt={product.name} className="h-[520px] w-full rounded-[2rem] object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {product.gallery.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`overflow-hidden rounded-[1.5rem] border-2 ${
                    currentImage === image ? 'border-accent' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={product.name} className="h-28 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
            <div className="text-sm uppercase tracking-[0.3em] text-roseBrown/70">{product.brand}</div>
            <h1 className="mt-4 font-display text-5xl leading-none text-ink">{product.name}</h1>
            <div className="mt-5">
              <Rating value={product.rating} reviewsCount={product.reviewsCount} size="lg" />
            </div>
            <p className="mt-5 text-muted">{product.description}</p>
            <div className="mt-6 flex items-end gap-3">
              <div className="text-3xl font-bold text-ink">{formatPrice(product.price)}</div>
              {product.oldPrice ? (
                <div className="text-sm text-roseBrown/50 line-through">{formatPrice(product.oldPrice)}</div>
              ) : null}
            </div>
            <div className="mt-6">
              <div className="mb-3 text-sm font-semibold text-ink">Выберите вариант</div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      currentVariant === variant
                        ? 'border-accent bg-accent text-white'
                        : 'border-line bg-white'
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 text-sm text-roseBrown/80">
              {product.inStock ? 'В наличии и готов к отправке' : 'Временно отсутствует'}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                className="flex-1"
                onClick={() => addItem(product, currentVariant)}
                icon={<FiShoppingBag />}
              >
                В корзину
              </Button>
              <Button type="button" variant="secondary" className="flex-1">
                Купить в один клик
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => toggleWishlist(product.id)}
                icon={<FiHeart className={wishlistIds.includes(product.id) ? 'fill-current' : ''} />}
              >
                В избранное
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <TabGroup>
            <TabList className="flex flex-wrap gap-3">
              {['Описание', 'Состав', 'Отзывы'].map((tab) => (
                <Tab
                  key={tab}
                  className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink ui-selected:border-accent ui-selected:bg-accent ui-selected:text-white"
                >
                  {tab}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-8 rounded-[2rem] bg-white p-8 shadow-card">
              <TabPanel>
                <p className="text-muted">{product.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.features.map((feature) => (
                    <span key={feature} className="rounded-full bg-blush px-4 py-2 text-sm text-ink">
                      {feature}
                    </span>
                  ))}
                </div>
              </TabPanel>
              <TabPanel>
                <p className="text-muted">{product.composition}</p>
              </TabPanel>
              <TabPanel>
                <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="rounded-[1.5rem] border border-line p-5">
                        <div className="font-semibold text-ink">{review.author}</div>
                        <div className="mt-1 text-sm text-roseBrown/70">{review.date}</div>
                        <div className="mt-3">
                          <Rating value={review.rating} />
                        </div>
                        <p className="mt-3 text-muted">{review.text}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4 rounded-[1.5rem] border border-line p-5">
                    <h3 className="text-xl font-semibold text-ink">Добавить отзыв</h3>
                    <input
                      {...register('author')}
                      placeholder="Ваше имя"
                      className="h-12 w-full rounded-2xl border border-line px-4"
                    />
                    <select {...register('rating')} className="h-12 w-full rounded-2xl border border-line px-4">
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value} звезд
                        </option>
                      ))}
                    </select>
                    <textarea
                      {...register('text')}
                      rows="5"
                      placeholder="Поделитесь впечатлениями"
                      className="w-full rounded-2xl border border-line px-4 py-3"
                    />
                    <Button type="submit" className="w-full">
                      Отправить отзыв
                    </Button>
                  </form>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>

        <div className="mt-16">
          <SectionHeading eyebrow="С этим товаром покупают" title="Готовый набор к вашему выбору" />
          <div className="mt-8">
            <Carousel>
              {bundleProducts.map((item) => (
                <SwiperSlide key={item.id}>
                  <ProductCard product={item} />
                </SwiperSlide>
              ))}
            </Carousel>
          </div>
        </div>

        <div className="mt-16">
          <SectionHeading eyebrow="Похожие товары" title="Еще варианты в похожем настроении" />
          <div className="mt-8">
            <Carousel>
              {relatedProducts.map((item) => (
                <SwiperSlide key={item.id}>
                  <ProductCard product={item} />
                </SwiperSlide>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
