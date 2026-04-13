import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/api.js';
import { queryKeys } from '@/services/queryKeys.js';

const useProducts = () =>
  useQuery({
    queryKey: queryKeys.products,
    queryFn: fetchProducts
  });

export default useProducts;
