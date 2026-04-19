import axios from 'axios';
import { nanoid } from 'nanoid';
import { blogPosts } from '@/data/blogPosts.js';
import { products } from '@/data/products.js';
import { createDelay } from '@/utils/helpers.js';
import { supabase } from '@/lib/supabaseClient.js';

export const api = axios.create({
  baseURL: '/api'
});

let localProducts = [...products];

export const fetchProducts = async () => {
  try {
    // Сначала попробуем загрузить из Supabase
    const { data, error } = await supabase
      .from('products')
      .select('catalog');

    if (error) {
      console.error('Error fetching from Supabase:', error);
      // Fallback to local products
      return createDelay(localProducts, 450);
    }

    if (data && data.length > 0) {
      // Преобразуем данные из Supabase в формат products
      const supabaseProducts = data.flatMap(item => 
        item.catalog.products.map(product => ({
          id: product.id,
          slug: product.name_ru.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          brand: product.brand_line,
          name: product.name_ru,
          category: product.category_path?.[0]?.name_ru || 'cosmetics',
          type: product.type,
          price: product.pricing.premier_price || product.pricing.regular_price,
          oldPrice: product.pricing.discount_percent > 0 ? product.pricing.regular_price : null,
          rating: 4.5, // Default rating
          reviewsCount: 0,
          inStock: product.availability.in_stock,
          isNew: product.is_new,
          discountPercent: product.pricing.discount_percent,
          description: product.description_ru,
          image: product.images.primary,
          gallery: [product.images.primary, product.images.secondary].filter(Boolean),
          volumeOptions: [product.volume],
          selectedVariant: product.volume,
          relatedIds: [],
          bundleIds: product.actions?.filter(a => a.type === 'bundle_promotion').map(a => a.target_product_id) || []
        }))
      );
      return createDelay(supabaseProducts, 450);
    }

    // Fallback to local products
    return createDelay(localProducts, 450);
  } catch (err) {
    console.error('Error fetching products:', err);
    return createDelay(localProducts, 450);
  }
};

export const fetchProductBySlug = async (slug) => {
  const product = localProducts.find((item) => item.slug === slug);

  if (!product) {
    throw new Error('Товар не найден');
  }

  return createDelay(product, 350);
};

export const fetchBlogPosts = async () => createDelay(blogPosts, 300);

export const fetchBlogPostBySlug = async (slug) => {
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    throw new Error('Статья не найдена');
  }

  return createDelay(post, 250);
};

export const submitReview = async ({ productId, review }) => {
  localProducts = localProducts.map((product) => {
    if (product.id !== productId) {
      return product;
    }

    return {
      ...product,
      reviewsCount: product.reviewsCount + 1,
      rating: Number(((product.rating + review.rating) / 2).toFixed(1)),
      reviews: [
        {
          id: nanoid(),
          date: '13 апреля 2026',
          ...review
        },
        ...product.reviews
      ]
    };
  });

  return createDelay({ success: true }, 400);
};
