import axios from 'axios';
import { nanoid } from 'nanoid';
import { blogPosts } from '@/data/blogPosts.js';
import { createDelay } from '@/utils/helpers.js';
import { supabase } from '@/lib/supabaseClient.js';

export const api = axios.create({
  baseURL: '/api'
});

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
