import axios from 'axios';
import { nanoid } from 'nanoid';
import { blogPosts } from '@/data/blogPosts.js';
import { products } from '@/data/products.js';
import { createDelay } from '@/utils/helpers.js';

export const api = axios.create({
  baseURL: '/api'
});

let localProducts = [...products];

export const fetchProducts = async () => {
  return createDelay(localProducts, 450);
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
