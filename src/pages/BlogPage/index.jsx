import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import Seo from '@/components/common/Seo/index.jsx';
import { fetchBlogPosts } from '@/services/api.js';
import { queryKeys } from '@/services/queryKeys.js';

const BlogPage = () => {
  const { t } = useTranslation();
  const { data: posts = [] } = useQuery({
    queryKey: queryKeys.blogPosts,
    queryFn: fetchBlogPosts
  });

  return (
    <>
      <Seo title={`${t('common.blog')} | Lumina`} />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('common.blog') }]} />
        <div className="mt-6">
          <h1 className="section-title">{t('blogPage.title')}</h1>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="surface-card surface-hover overflow-hidden">
                <img src={post.image} alt={post.title} className="h-72 w-full object-cover" />
                <div className="p-6">
                  <div className="text-sm uppercase tracking-[0.25em] text-roseBrown/70 dark:text-slate-400">{post.category}</div>
                  <div className="mt-3 text-2xl font-semibold text-ink dark:text-slate-100">{post.title}</div>
                  <p className="mt-3 text-muted">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;
