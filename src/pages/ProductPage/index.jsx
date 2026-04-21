import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { SwiperSlide } from 'swiper/react';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import Button from '@/components/common/Button/index.jsx';
import Modal from '@/components/common/Modal/index.jsx';
import Rating from '@/components/product/Rating/index.jsx';
import ProductCard from '@/components/product/ProductCard/index.jsx';
import Carousel from '@/components/ui/Carousel/index.jsx';
import SectionHeading from '@/components/ui/SectionHeading/index.jsx';
import { fetchProductBySlug, fetchProducts, sendTelegramOrder, submitReview } from '@/services/api.js';
import { queryKeys } from '@/services/queryKeys.js';
import { useCartStore } from '@/store/cartStore.js';
import { useWishlistStore } from '@/store/wishlistStore.js';
import { formatPrice } from '@/utils/formatPrice.js';

const ProductPage = () => {
  const { slug } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const wishlistIds = useWishlistStore((state) => state.ids);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [isImagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [isTelegramModalOpen, setTelegramModalOpen] = useState(false);
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
  const {
    register: registerOrder,
    handleSubmit: handleOrderSubmit,
    reset: resetOrder
  } = useForm({
    defaultValues: { name: '', phone: '', comment: '' }
  });
  const queryClient = useQueryClient();
  const currentVariant = selectedVariant || product?.selectedVariant;

  const mutation = useMutation({
    mutationFn: (review) => submitReview({ productId: product?.id, review }),
    onSuccess: async () => {
      toast.success('Отзыв опубликован');
      reset();
      await queryClient.invalidateQueries({ queryKey: queryKeys.product(slug) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
    onError: () => {
      toast.error('Не удалось отправить отзыв. Попробуйте позже.');
    }
  });

  const orderMutation = useMutation({
    mutationFn: (values) => sendTelegramOrder({ product, variant: currentVariant, order: values }),
    onSuccess: () => {
      toast.success('Заявка отправлена в Telegram');
      resetOrder();
      setTelegramModalOpen(false);
    },
    onError: () => {
      toast.error('Не удалось отправить заявку. Попробуйте позже.');
    }
  });

  const relatedProducts = useMemo(
    () => {
      if (!product?.relatedIds?.length) return [];
      return products.filter((item) => product.relatedIds.includes(item.id));
    },
    [product, products]
  );

  const bundleProducts = useMemo(
    () => {
      if (!product?.bundleIds?.length) return [];
      return products.filter((item) => product.bundleIds.includes(item.id));
    },
    [product, products]
  );

  if (!product) {
    return null;
  }

  const currentImage = activeImage || product.gallery?.[0] || product.image || '';

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
            <div className="surface-card overflow-hidden p-3 sm:p-4">
              <button
                type="button"
                onClick={() => setImagePreviewOpen(true)}
                className="group block w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]"
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  className="h-[340px] w-full cursor-zoom-in object-cover transition duration-300 group-hover:scale-[1.02] sm:h-[440px] lg:h-[520px]"
                />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
              {(product.gallery || []).map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`overflow-hidden rounded-[1.5rem] border-2 ${
                    currentImage === image ? 'border-accent' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={product.name} className="h-20 w-full object-cover sm:h-28" />
                </button>
              ))}
            </div>
          </div>

          <div className="surface-card p-5 sm:p-8">
            <div className="text-sm uppercase tracking-[0.3em] text-roseBrown/70 dark:text-slate-400">{product.brand}</div>
            <h1 className="mt-4 font-display text-3xl leading-tight text-ink dark:text-slate-100 sm:text-5xl sm:leading-none">{product.name}</h1>
            <div className="mt-5">
              <Rating value={product.rating} reviewsCount={product.reviewsCount} size="lg" />
            </div>
            <p className="mt-5 text-muted">{product.description}</p>
            <div className="mt-6 flex items-end gap-3">
              <div className="text-3xl font-bold text-ink dark:text-slate-100">{formatPrice(product.price)}</div>
              {product.oldPrice ? (
                <div className="text-sm text-roseBrown/50 line-through dark:text-slate-500">{formatPrice(product.oldPrice)}</div>
              ) : null}
            </div>
            <div className="mt-6">
              <div className="mb-3 text-sm font-semibold text-ink dark:text-slate-100">Выберите вариант</div>
              <div className="flex flex-wrap gap-2">
                {(product.variants || []).map((variant) => (
                  <button
                    key={variant}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      currentVariant === variant
                        ? 'border-accent bg-accent text-white'
                        : 'border-line bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 text-sm text-roseBrown/80 dark:text-slate-300">
              {product.inStock ? 'В наличии и готов к отправке' : 'Временно отсутствует'}
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                type="button"
                className="w-full"
                onClick={() => addItem(product, currentVariant)}
                icon={<FiShoppingBag />}
              >
                В корзину
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => setTelegramModalOpen(true)}
              >
                Заказать через Telegram
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:col-span-2"
                onClick={() => toggleWishlist(product.id)}
                icon={<FiHeart className={wishlistIds.includes(product.id) ? 'fill-current' : ''} />}
              >
                В избранное
              </Button>
            </div>
            <Modal
              isOpen={isImagePreviewOpen}
              onClose={() => setImagePreviewOpen(false)}
            >
              <div className="-m-2 sm:-m-4">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="max-h-[80vh] w-full rounded-[1.5rem] object-contain"
                />
              </div>
            </Modal>
            <Modal
              isOpen={isTelegramModalOpen}
              onClose={() => setTelegramModalOpen(false)}
              title="Заказать через Telegram"
            >
              <form
                onSubmit={handleOrderSubmit((values) => orderMutation.mutate(values))}
                className="space-y-4"
              >
                <input
                  {...registerOrder('name')}
                  placeholder="Ваше имя"
                  className="focus-ring h-12 w-full rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <input
                  {...registerOrder('phone')}
                  placeholder="Телефон"
                  className="focus-ring h-12 w-full rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <textarea
                  {...registerOrder('comment')}
                  rows="4"
                  placeholder="Комментарий к заказу"
                  className="focus-ring w-full rounded-2xl border border-line bg-white px-4 py-3 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button type="submit" className="w-full" disabled={orderMutation.isLoading}>
                    {orderMutation.isLoading ? 'Отправляется...' : 'Отправить заявку'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setTelegramModalOpen(false)}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </Modal>
          </div>
        </div>

        <div className="mt-16">
          <TabGroup>
            <TabList className="flex flex-wrap gap-3">
              {['Описание', 'Состав', 'Отзывы'].map((tab) => (
                <Tab
                  key={tab}
                  className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink ui-selected:border-accent ui-selected:bg-accent ui-selected:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {tab}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="surface-card mt-8 p-5 sm:p-8">
              <TabPanel>
                <p className="text-muted">{product.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(product.features || []).map((feature) => (
                    <span key={feature} className="rounded-full bg-blush px-4 py-2 text-sm text-ink dark:bg-slate-800 dark:text-slate-100">
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
                    {(product.reviews || []).map((review) => (
                      <div key={review.id} className="rounded-[1.5rem] border border-line p-5 dark:border-slate-700">
                        <div className="font-semibold text-ink dark:text-slate-100">{review.author}</div>
                        <div className="mt-1 text-sm text-roseBrown/70 dark:text-slate-400">{review.date}</div>
                        <div className="mt-3">
                          <Rating value={review.rating} />
                        </div>
                        <p className="mt-3 text-muted">{review.text}</p>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={handleSubmit((values) => {
                      if (!product) return;
                      mutation.mutate(values);
                    })}
                    className="space-y-4 rounded-[1.5rem] border border-line p-5 dark:border-slate-700"
                  >
                    <h3 className="text-xl font-semibold text-ink dark:text-slate-100">Добавить отзыв</h3>
                    <input
                      {...register('author')}
                      placeholder="Ваше имя"
                      className="focus-ring h-12 w-full rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                    <select
                      {...register('rating')}
                      className="focus-ring h-12 w-full rounded-2xl border border-line bg-white px-4 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
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
                      className="focus-ring w-full rounded-2xl border border-line bg-white px-4 py-3 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                    <Button type="submit" className="w-full" disabled={mutation.isLoading}>
                      {mutation.isLoading ? 'Отправка...' : 'Отправить отзыв'}
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
