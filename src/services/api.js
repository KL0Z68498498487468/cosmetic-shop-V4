import axios from 'axios';
import { nanoid } from 'nanoid';
import { blogPosts } from '@/data/blogPosts.js';
import { createDelay } from '@/utils/helpers.js';
import { supabase } from '@/lib/supabaseClient.js';

export const api = axios.create({
  baseURL: '/api'
});

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
      // Преобразуем данные из Supabase в формат products
      const supabaseProducts = data.flatMap(item => 
        (item.catalog?.products || []).map(product => {
          const name = product.name_ru || product.name_uz || product.name || 'Product';
          const slugBase = String(name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          const gallery = [product.images?.primary, product.images?.secondary].filter(Boolean);
          const pricing = product.pricing || {};

          return {
            id: product.id || nanoid(),
            slug: slugBase || `product-${product.id || Math.random().toString(36).slice(2, 8)}`,
            brand: product.brand_line || product.brand || '',
            name,
            category: normalizeCategory(product.category_path),
            type: product.type || '',
            price: pricing.premier_price ?? pricing.regular_price ?? 0,
            oldPrice: pricing.discount_percent > 0 ? pricing.regular_price : null,
            rating: product.rating ?? 4.5,
            reviewsCount: product.reviewsCount ?? 0,
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
            reviews: Array.isArray(product.reviews) ? product.reviews : [],
            relatedIds: Array.isArray(product.relatedIds) ? product.relatedIds : [],
            bundleIds: Array.isArray(product.actions)
              ? product.actions
                  .filter((action) => action && typeof action === 'object' && action.type === 'bundle_promotion')
                  .map((action) => action.target_product_id)
                  .filter(Boolean)
              : [],
            tags: Array.isArray(product.tags) ? product.tags : [],
            recommendationScore: product.recommendation_score ?? 85,
            topDay: false,
            topWeek: false
          };
        })
      );
      return supabaseProducts;
    }

    return [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};

export const fetchProductBySlug = async (slug) => {
  // Для простоты, получаем все продукты и ищем по slug
  const products = await fetchProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    throw new Error('Товар не найден');
  }

  return product;
};

export const fetchBlogPosts = async () => createDelay(blogPosts, 300);

export const fetchBlogPostBySlug = async (slug) => {
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    throw new Error('Статья не найдена');
  }

  return createDelay(post, 250);
};
