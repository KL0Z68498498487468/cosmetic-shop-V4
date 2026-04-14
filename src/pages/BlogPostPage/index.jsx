import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import { fetchBlogPostBySlug } from '@/services/api.js';
import { queryKeys } from '@/services/queryKeys.js';

const BlogPostPage = () => {
  const { slug } = useParams();
  const { data: post } = useQuery({
    queryKey: queryKeys.blogPost(slug),
    queryFn: () => fetchBlogPostBySlug(slug)
  });

  if (!post) {
    return null;
  }

  return (
    <>
      <Seo title={`${post.title} | Lumina`} description={post.excerpt} image={post.image} />
      <div className="container-shell py-8">
        <Breadcrumbs
          items={[
            { label: 'Главная', to: '/' },
            { label: 'Блог', to: '/blog' },
            { label: post.title }
          ]}
        />
        <article className="surface-card mt-6 p-5 sm:p-8">
          <img src={post.image} alt={post.title} className="h-[260px] w-full rounded-[1.4rem] object-cover sm:h-[360px] sm:rounded-[2rem] lg:h-[420px]" />
          <div className="mt-8 text-sm uppercase tracking-[0.25em] text-roseBrown/70 dark:text-slate-400">{post.category}</div>
          <h1 className="mt-4 font-display text-3xl leading-tight text-ink dark:text-slate-100 sm:text-5xl sm:leading-none">{post.title}</h1>
          <div className="mt-4 text-sm text-roseBrown/70 dark:text-slate-400">
            {post.date} • {post.readTime}
          </div>
          <div className="mt-8 space-y-5 text-base leading-8 text-roseBrown/90 dark:text-slate-300">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogPostPage;
