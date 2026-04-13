export const filterProducts = (products, filters) => {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }

    if (filters.inStock && !product.inStock) {
      return false;
    }

    if (filters.newOnly && !product.isNew) {
      return false;
    }

    if (filters.discountOnly && !product.oldPrice) {
      return false;
    }

    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    if (filters.rating && product.rating < filters.rating) {
      return false;
    }

    if (filters.search) {
      const searchValue = filters.search.toLowerCase();
      const haystack = `${product.name} ${product.brand} ${product.type}`.toLowerCase();

      if (!haystack.includes(searchValue)) {
        return false;
      }
    }

    return true;
  });
};

export const sortProducts = (products, sortBy) => {
  const result = [...products];

  switch (sortBy) {
    case 'priceAsc':
      return result.sort((a, b) => a.price - b.price);
    case 'priceDesc':
      return result.sort((a, b) => b.price - a.price);
    case 'rating':
      return result.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    default:
      return result.sort(
        (a, b) =>
          Number(b.topWeek) - Number(a.topWeek) ||
          b.recommendationScore - a.recommendationScore
      );
  }
};
