import axios from 'axios';
import { nanoid } from 'nanoid';
import { blogPosts } from '@/data/blogPosts.js';
import { createDelay } from '@/utils/helpers.js';
import { supabase } from '@/lib/supabaseClient.js';

export const api = axios.create({
  baseURL: '/api'
});

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export const sendTelegramOrder = async ({ product, variant, order }) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('Telegram bot token or chat id is not configured');
  }

  const messageLines = [
    'Новая заявка на заказ через Telegram: ✔️',
    `Товар: ${product.name}`,
    variant ? `Вариант: ${variant}` : null,
    `Цена: ${product.price}`,
    `Имя: ${order.name || 'не указано'}`,
    `Телефон: ${order.phone || 'не указан'}`,
    order.comment ? `Комментарий: ${order.comment}` : null,
    `Ссылка: ${window.location.origin}/catalog/${product.slug}`
  ].filter(Boolean);

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: messageLines.join('\n'),
      parse_mode: 'HTML'
    })
  });

  const result = await response.json();

  if (!response.ok || result?.ok === false) {
    throw new Error(result?.description || 'Не удалось отправить заявку в Telegram');
  }

  // Записываем факт заказа в Supabase для работы слайдеров
  if (product?.id) {
    await recordProductOrder(product.id).catch(() => {});
  }

  return result;
};

export const sendTelegramCartOrder = async ({ cart, order, total }) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('Telegram bot token or chat id is not configured');
  }

  const messageLines = [
    '🛒 Новая заявка на заказ из корзины:',
    '',
    '📦 Товары:'
  ];

  cart.forEach((item, index) => {
    messageLines.push(`${index + 1}. ${item.product.name} - ${item.quantity} шт. x ${item.product.price} = ${item.total}`);
  });

  messageLines.push(
    '',
    `💰 Итого: ${total}`,
    '',
    `👤 Имя: ${order.name || 'не указано'}`,
    `📞 Телефон: ${order.phone || 'не указан'}`,
    order.comment ? `💬 Комментарий: ${order.comment}` : null,
    '',
    `🔗 Ссылка: ${window.location.origin}/cart`
  );

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: messageLines.filter(Boolean).join('\n'),
      parse_mode: 'HTML'
    })
  });

  const result = await response.json();

  if (!response.ok || result?.ok === false) {
    throw new Error(result?.description || 'Не удалось отправить заявку в Telegram');
  }

  return result;
};

/**
 * Записывает один Telegram-заказ в таблицу product_orders.
 * Используется для подсчёта популярности товаров в слайдерах.
 */
export const recordProductOrder = async (productId) => {
  if (!supabase || !productId) return;
  const { error } = await supabase
    .from('product_orders')
    .insert([{ product_id: String(productId) }]);
  if (error) {
    console.error('Error recording product order:', error);
  }
};

/**
 * Загружает статистику заказов за сегодня и за 7 дней для всех товаров.
 * Возвращает Map: productId → { ordersToday, ordersWeek, ordersTotal }
 */
const fetchOrderStats = async () => {
  if (!supabase) return new Map();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  startOfWeek.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('product_orders')
    .select('product_id, created_at')
    .gte('created_at', startOfWeek.toISOString());

  if (error || !Array.isArray(data)) {
    console.error('Error fetching order stats:', error);
    return new Map();
  }

  const todayMs = startOfToday.getTime();
  const statsMap = new Map();

  data.forEach(({ product_id, created_at }) => {
    const existing = statsMap.get(product_id) || { ordersToday: 0, ordersWeek: 0, ordersTotal: 0 };
    existing.ordersWeek += 1;
    existing.ordersTotal += 1;
    if (new Date(created_at).getTime() >= todayMs) {
      existing.ordersToday += 1;
    }
    statsMap.set(product_id, existing);
  });

  return statsMap;
};

const normalizeCategory = (categoryPath) => {
  if (!categoryPath) return 'cosmetics';
  if (Array.isArray(categoryPath) && categoryPath.length > 0) {
    const first = categoryPath[0];
    if (typeof first === 'object') {
      return first.name_ru || first.name || 'cosmetics';
    }
    return first;
  }
  return categoryPath;
};

const formatProductReview = (review) => ({
  ...review,
  date: review.created_at ? new Date(review.created_at).toLocaleDateString('ru-RU') : review.date || ''
});

const normalizeReviewRating = (rating) => {
  const value = Number(rating);
  return Number.isFinite(value) && value > 0 ? value : null;
};

const buildRatingSummary = (reviews = [], fallbackRating = 0) => {
  const ratings = reviews
    .map((review) => normalizeReviewRating(review?.rating))
    .filter((rating) => rating !== null);

  if (!ratings.length) {
    return {
      rating: normalizeReviewRating(fallbackRating) ?? 0,
      reviewsCount: 0
    };
  }

  const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

  return {
    rating: Number(averageRating.toFixed(1)),
    reviewsCount: ratings.length
  };
};

export const fetchProductReviewsById = async (productId) => {
  if (!supabase || !productId) return [];

  const { data, error } = await supabase
    .from('product_reviews')
    .select('id, author, rating, text, created_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching product reviews from Supabase:', error);
    return [];
  }

  return Array.isArray(data) ? data.map(formatProductReview) : [];
};

export const submitReview = async ({ productId, review }) => {
  if (!supabase || !productId) {
    throw new Error('Supabase не настроен или отсутствует productId');
  }

  const reviewPayload = {
    product_id: productId,
    author: review.author || 'Аноним',
    rating: Number(review.rating) || 5,
    text: review.text || ''
  };

  const { data, error } = await supabase
    .from('product_reviews')
    .insert([reviewPayload])
    .select();

  if (error) {
    throw error;
  }

  return Array.isArray(data) ? data[0] : null;
};

export const fetchProducts = async () => {
  try {
    // Загружаем из Supabase
    const { data, error } = await supabase
      .from('products')
      .select('catalog');

    if (error) {
      console.error('Error fetching from Supabase:', error);
      return [];
    }

    if (data && data.length > 0) {
      const supabaseProducts = data.flatMap(item => 
        (item.catalog?.products || []).map(product => {
          const name = product.name_ru || product.name_uz || product.name || 'Product';
          const slugBase = String(name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          const gallery = [product.images?.primary, product.images?.secondary].filter(Boolean);
          const pricing = product.pricing || {};
          const baseReviews = Array.isArray(product.reviews) ? product.reviews.map(formatProductReview) : [];
          const baseRatingSummary = buildRatingSummary(baseReviews, product.rating);

          return {
            id: product.id || nanoid(),
            slug: slugBase || `product-${product.id || Math.random().toString(36).slice(2, 8)}`,
            brand: product.brand_line || product.brand || '',
            name,
            category: normalizeCategory(product.category_path),
            type: product.type || '',
            price: pricing.premier_price ?? pricing.regular_price ?? 0,
            oldPrice: pricing.discount_percent > 0 ? pricing.regular_price : null,
            rating: baseRatingSummary.rating,
            reviewsCount: baseRatingSummary.reviewsCount,
            inStock: product.availability?.in_stock ?? true,
            isNew: product.is_new ?? false,
            discountPercent: pricing.discount_percent ?? 0,
            badge: product.is_new ? 'Новый' : null,
            description: product.description_ru || product.description || '',
            image: product.images?.primary || product.image || '',
            gallery,
            variants: product.volume ? [product.volume] : [],
            volumeOptions: product.volume ? [product.volume] : [],
            selectedVariant: product.volume || '',
            shades: [],
            features: Array.isArray(product.fragrance_notes) && product.fragrance_notes.length > 0
              ? product.fragrance_notes
              : Array.isArray(product.specifications?.effect) && product.specifications.effect.length > 0
                ? product.specifications.effect
                : ['Основной уход'],
            composition: product.composition || product.description_ru || product.description || '',
            reviews: baseReviews,
            relatedIds: Array.isArray(product.relatedIds) ? product.relatedIds : [],
            bundleIds: Array.isArray(product.actions)
              ? product.actions
                  .filter((action) => action && typeof action === 'object' && action.type === 'bundle_promotion')
                  .map((action) => action.target_product_id)
                  .filter(Boolean)
              : [],
            tags: Array.isArray(product.tags) ? product.tags : [],
            recommendationScore: product.recommendation_score ?? null,
            topDay: Boolean(product.top_day),
            topWeek: Boolean(product.top_week)
          };
        })
      );

      const productIds = supabaseProducts.map((item) => item.id).filter(Boolean);

      // Загружаем статистику заказов и отзывов параллельно
      const [orderStatsMap, reviewRows] = await Promise.all([
        fetchOrderStats(),
        productIds.length > 0
          ? supabase
              .from('product_reviews')
              .select('product_id, rating')
              .in('product_id', productIds)
              .then(({ data, error }) => (error ? [] : data || []))
          : Promise.resolve([])
      ]);

      const reviewsByProductId = reviewRows.reduce((acc, row) => {
        const key = row.product_id;
        acc[key] = [...(acc[key] || []), row];
        return acc;
      }, {});

      return supabaseProducts.map((product) => {
        const summary = buildRatingSummary(
          [...(product.reviews || []), ...(reviewsByProductId[product.id] || [])],
          product.rating
        );
        const stats = orderStatsMap.get(String(product.id)) || {
          ordersToday: 0,
          ordersWeek: 0,
          ordersTotal: 0
        };
        // Скор: рейтинг + отзывы + новинка/скидка + реальные заказы (каждый +4 балла)
        const computedScore = product.recommendationScore != null
          ? product.recommendationScore + stats.ordersTotal * 4
          : Math.round(
              summary.rating * 10 +
              summary.reviewsCount * 2 +
              (product.isNew ? 15 : 0) +
              (product.discountPercent > 0 ? 5 : 0) +
              stats.ordersTotal * 4
            );
        return {
          ...product,
          ...summary,
          ...stats,
          recommendationScore: computedScore
        };
      });
    }

    return [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};

export const fetchProductBySlug = async (slug) => {
  const products = await fetchProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    throw new Error('Товар не найден');
  }

  const reviews = await fetchProductReviewsById(product.id);
  const existingReviewIds = new Set((product.reviews || []).map((review) => review.id).filter(Boolean));
  const mergedReviews = [
    ...(product.reviews || []),
    ...reviews.filter((review) => !existingReviewIds.has(review.id))
  ];

  return {
    ...product,
    reviews: mergedReviews,
    ...buildRatingSummary(mergedReviews, product.rating)
  };
};

export const fetchBlogPosts = async () => createDelay(blogPosts, 300);

export const fetchBlogPostBySlug = async (slug) => {
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    throw new Error('Статья не найдена');
  }

  return createDelay(post, 250);
};
