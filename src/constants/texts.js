export const getSiteTexts = (t) => ({
  brandName: 'Lumina',
  tagline: t('site.tagline'),
  nav: [
    { label: t('nav.catalog'), to: '/catalog' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.blog'), to: '/blog' },
    { label: t('nav.contacts'), to: '/contacts' }
  ],
  categories: [
    {
      title: t('site.categories.skincare.title'),
      slug: 'skincare',
      description: t('site.categories.skincare.description'),
      image:
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: t('site.categories.makeup.title'),
      slug: 'makeup',
      description: t('site.categories.makeup.description'),
      image:
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: t('site.categories.perfume.title'),
      slug: 'perfume',
      description: t('site.categories.perfume.description'),
      image:
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80'
    }
  ],
  hero: {
    overline: t('site.hero.overline'),
    title: t('site.hero.title'),
    description: t('site.hero.description'),
    ctaPrimary: t('site.hero.ctaPrimary'),
    ctaSecondary: t('site.hero.ctaSecondary')
  },
  footerLinks: {
    company: [
      { label: t('footer.brand'), to: '/about' },
      { label: t('nav.blog'), to: '/blog' },
      { label: t('nav.contacts'), to: '/contacts' }
    ]
  },
  newsletter: t('footer.newsletter')
});
