import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useDeferredValue, useMemo, useState } from 'react';
import {
  FiHeart, FiMoon, FiSearch, FiShoppingBag,
  FiSun, FiUser, FiMenu, FiX, FiChevronRight
} from 'react-icons/fi';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input/index.jsx';
import { siteTexts } from '@/constants/texts.js';
import useProducts from '@/hooks/useProducts.js';
import useWishlist from '@/hooks/useWishlist.js';
import { useCartStore } from '@/store/cartStore.js';
import { useThemeStore } from '@/store/themeStore.js';

const Header = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const { data: products = [] } = useProducts();
  const { ids } = useWishlist(products);
  const cartItemsCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const { isDark, toggleTheme } = useThemeStore();

  const searchResults = useMemo(() => {
    if (!deferredQuery.trim()) return [];
    return products
      .filter((p) =>
        `${p.name} ${p.brand}`.toLowerCase().includes(deferredQuery.toLowerCase())
      )
      .slice(0, 4);
  }, [deferredQuery, products]);

  const closeDrawer = () => setDrawerOpen(false);

  const handleSelect = (slug) => {
    setQuery('');
    setSearchOpen(false);
    navigate(`/catalog/${slug}`);
  };

  const SearchDropdown = () => (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-[1.5rem] border border-line bg-white p-3 shadow-soft">
      {searchResults.map((product) => (
        <button
          key={product.id}
          type="button"
          onClick={() => handleSelect(product.slug)}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-blush/60"
        >
          <img src={product.image} alt={product.name} className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover" />
          <div>
            <div className="font-semibold text-ink">{product.name}</div>
            <div className="text-xs text-roseBrown/70">{product.brand}</div>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="container-shell">

          {/* ── Основная строка ─────────────────────────────── */}
          <div className="flex h-16 items-center justify-between gap-2">

            {/* Бургер (мобайл) */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border border-line bg-white transition hover:border-accent lg:hidden"
            >
              <FiMenu size={18} />
            </button>

            {/* Логотип */}
            <Link to="/" className="flex flex-shrink-0 items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-base font-bold text-white">
                L
              </span>
              <div className="hidden sm:block">
                <div className="font-display text-2xl font-semibold leading-none">Lumina</div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-roseBrown/70">beauty store</div>
              </div>
              <div className="font-display text-xl font-semibold leading-none sm:hidden">Lumina</div>
            </Link>

            {/* Поиск — только десктоп */}
            <div className="relative hidden flex-1 max-w-xl lg:block">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Найти парфюм, сыворотку, бренд..."
                className="pr-12"
              />
              <FiSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-roseBrown/70" />
              {searchResults.length ? <SearchDropdown /> : null}
            </div>

            {/* Иконки */}
            <div className="flex items-center gap-1.5">
              {/* Поиск (мобайл) */}
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-accent lg:hidden"
              >
                {searchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
              </button>

              {/* Тема */}
              <button
                type="button"
                onClick={toggleTheme}
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-accent"
              >
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {/* Профиль — скрыт на мобайле (есть в drawer) */}
              <NavLink
                to="/profile"
                className="hidden h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-accent lg:grid"
              >
                <FiUser size={18} />
              </NavLink>

              <NavLink
                to="/wishlist"
                className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-accent"
              >
                <FiHeart size={18} />
                {ids.length ? (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">
                    {ids.length}
                  </span>
                ) : null}
              </NavLink>

              <NavLink
                to="/cart"
                className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-accent"
              >
                <FiShoppingBag size={18} />
                {cartItemsCount ? (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-white">
                    {cartItemsCount}
                  </span>
                ) : null}
              </NavLink>
            </div>
          </div>

          {/* ── Мобильный поиск (раскрывается) ──────────────── */}
          {searchOpen && (
            <div className="relative pb-3 lg:hidden">
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Найти парфюм, сыворотку, бренд..."
                className="pr-12"
              />
              <FiSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-roseBrown/70" />
              {searchResults.length ? <SearchDropdown /> : null}
            </div>
          )}

          {/* ── Нижняя строка — только десктоп ───────────────── */}
          <div className="hidden items-center justify-between gap-4 pb-3 lg:flex">
            <Menu as="div" className="relative">
              <MenuButton className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
                Категории и мегаменю
              </MenuButton>
              <MenuItems className="absolute left-0 mt-3 grid w-[min(720px,90vw)] gap-4 rounded-[2rem] border border-line bg-white p-5 shadow-soft focus:outline-none md:grid-cols-3">
                {siteTexts.categories.map((category) => (
                  <MenuItem key={category.slug}>
                    <Link
                      to={`/catalog?category=${category.slug}`}
                      className="rounded-[1.5rem] p-3 transition hover:bg-blush/60"
                    >
                      <img src={category.image} alt={category.title} className="h-32 w-full rounded-[1.25rem] object-cover" />
                      <div className="mt-3 font-semibold text-ink">{category.title}</div>
                      <div className="mt-1 text-sm text-roseBrown/75">{category.description}</div>
                    </Link>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>

            <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold text-roseBrown/80">
              {siteTexts.nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `transition hover:text-accent ${isActive ? 'text-accent' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

        </div>
      </header>

      {/* ── Drawer: оверлей ──────────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* ── Drawer: само меню ────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(320px,90vw)] flex-col bg-white shadow-soft transition-transform duration-300 lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Шапка */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Link to="/" onClick={closeDrawer} className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-base font-bold text-white">L</span>
            <div className="font-display text-2xl font-semibold leading-none">Lumina</div>
          </Link>
          <button
            type="button"
            onClick={closeDrawer}
            className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-accent"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Контент */}
        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6">

          {/* Профиль */}
          <NavLink
            to="/profile"
            onClick={closeDrawer}
            className="flex items-center gap-3 rounded-2xl border border-line p-3 transition hover:bg-blush/40"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-roseBrown">
              <FiUser size={18} />
            </span>
            <span className="text-sm font-semibold text-ink">Мой профиль</span>
            <FiChevronRight size={16} className="ml-auto text-roseBrown/40" />
          </NavLink>

          {/* Навигация */}
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-roseBrown/50">Разделы</div>
            <nav className="space-y-1">
              {siteTexts.nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeDrawer}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive ? 'bg-ink text-white' : 'text-ink hover:bg-blush/50'
                    }`
                  }
                >
                  {item.label}
                  <FiChevronRight size={15} className="opacity-40" />
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Категории */}
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-roseBrown/50">Категории</div>
            <div className="space-y-2.5">
              {siteTexts.categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/catalog?category=${category.slug}`}
                  onClick={closeDrawer}
                  className="flex items-center gap-3 overflow-hidden rounded-2xl border border-line transition hover:border-accent"
                >
                  <img src={category.image} alt={category.title} className="h-16 w-16 flex-shrink-0 object-cover" />
                  <div className="py-2 pr-2 min-w-0">
                    <div className="text-sm font-semibold text-ink">{category.title}</div>
                    <div className="mt-0.5 truncate text-xs text-roseBrown/70">{category.description}</div>
                  </div>
                  <FiChevronRight size={15} className="mr-3 flex-shrink-0 text-roseBrown/40" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Низ */}
        <div className="border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-ink transition hover:bg-blush/50"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            {isDark ? 'Светлая тема' : 'Тёмная тема'}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Header;