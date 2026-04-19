const ProductCardSkeleton = () => {
  return (
    <article className="surface-card relative overflow-hidden p-4">
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse dark:bg-slate-700" />
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse dark:bg-slate-700" />
      </div>

      <div className="block">
        <div className="relative overflow-hidden rounded-[1.6rem] bg-sand dark:bg-slate-800">
          <div className="aspect-square w-full bg-gray-200 animate-pulse dark:bg-slate-700" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-slate-700" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse dark:bg-slate-700" />
          <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse dark:bg-slate-700" />
        </div>
      </div>
    </article>
  );
};

export default ProductCardSkeleton;