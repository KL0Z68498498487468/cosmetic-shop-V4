import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useDeferredValue, useMemo, useState, useEffect } from 'react';
import {
  FiHeart, FiMoon, FiSearch, FiShoppingBag,
  FiSun, FiUser, FiMenu, FiX, FiChevronRight
} from 'react-icons/fi';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Input from '@/components/common/Input/index.jsx';
import { siteTexts } from '@/constants/texts.js';
import useProducts from '@/hooks/useProducts.js';
import useWishlist from '@/hooks/useWishlist.js';
import { useCartStore } from '@/store/cartStore.js';
import { useThemeStore } from '@/store/themeStore.js';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Закрываем всё при смене страницы
  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
    setQuery('');
  }, [location.pathname]);

  const searchResults = useMemo(() => {
    if (!deferredQuery.trim()) return [];
    return products
      .filter((p) =>
        `${p.name} ${p.brand}`.toLowerCase().includes(deferredQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [deferredQuery, products]);

  const closeDrawer = () => setDrawerOpen(false);

  const handleSelect = (slug) => {
    setQuery('');
    setSearchOpen(false);
    navigate(`/catalog/${slug}`);
  };

  const SearchDropdown = ({ isMobile = false }) => (
    <div className={`absolute left-0 right-0 z-50 rounded-[1.5rem] border border-line bg-white p-2 shadow-soft backdrop-blur-xl ${
      isMobile ? 'top-[calc(100%)] mx-4 mt-2' : 'top-[calc(100%+8px)]'
    }`}>
      <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
        {searchResults.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => handleSelect(product.slug)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-blush/60 active:bg-blush"
          >
            <img src={product.image} alt={product.name} className="h-12 w-12 flex-shrink-0 rounded-xl object-cover" />
            <div className="min-w-0">
              <div className="truncate font-semibold text-ink text-sm">{product.name}</div>
              <div className="text-[11px] text-roseBrown/70">{product.brand}</div>
            </div>
          </button>
        ))}
        {!searchResults.length && query && (
          <div className="p-4 text-center text-xs text-roseBrown/50 font-medium">Ничего не найдено</div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="container-shell px-4 sm:px-6">

          {/* ── Основная строка ─────────────────────────────── */}
          <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">

            {/* Бургер (мобайл) */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border border-line bg-white transition lg:hidden"
            >
              <FiMenu size={20} />
            </button>

            {/* Логотип */}
            <Link to="/" className="flex flex-shrink-0 items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-sm font-bold text-white sm:h-10 sm:w-10 sm:rounded-2xl sm:text-base">
                L
              </span>
              <div className="hidden xs:block">
                <div className="font-display text-xl font-semibold leading-none sm:text-2xl">Lumina</div>
                <div className="text-[9px] uppercase tracking-[0.24em] text-roseBrown/70 hidden sm:block">beauty store</div>
              </div>
            </Link>

            {/* Поиск — только десктоп */}
            <div className="relative hidden flex-1 max-w-md lg:block xl:max-w-xl">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Найти парфюм, бренд..."
                className="pr-12"
              />
              <FiSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-roseBrown/70" />
              {searchResults.length ? <SearchDropdown /> : null}
            </div>

            {/* Иконки */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Поиск (мобайл) */}
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className={`grid h-10 w-10 place-items-center rounded-full border transition lg:hidden ${
                  searchOpen ? 'border-accent bg-accent/5 text-accent' : 'border-line bg-white'
                }`}
              >
                {searchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white transition hover:border-accent"
              >
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              <NavLink
                to="/wishlist"
                className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-white transition hover:border-accent"
              >
                <FiHeart size={18} />
                {ids.length ? (
                  <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-white sm:h-5 sm:w-5 sm:text-[10px]">
                    {ids.length}
                  </span>
                ) : null}
              </NavLink>

              <NavLink
                to="/cart"
                className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-white transition hover:border-accent"
              >
                <FiShoppingBag size={18} />
                {cartItemsCount ? (
                  <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-ink text-[9px] font-bold text-white sm:h-5 sm:w-5 sm:text-[10px]">
                    {cartItemsCount}
                  </span>
                ) : null}
              </NavLink>
            </div>
          </div>

          {/* ── Мобильный поиск (раскрывается) ──────────────── */}
          {searchOpen && (
            <div className="relative pb-3 lg:hidden px-0.5">
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск..."
                className="pr-12 h-11"
              />
              <FiSearch className="pointer-events-none absolute right-4 top-[40%] -translate-y-1/2 text-roseBrown/70" />
              {query && <SearchDropdown isMobile />}
            </div>
          )}

          {/* ── Нижняя строка — только десктоп ───────────────── */}
          <div className="hidden items-center justify-between gap-4 pb-3 lg:flex">
            <Menu as="div" className="relative">
              <MenuButton className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/90">
                Категории
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
                      <div className="mt-1 text-xs text-roseBrown/75 line-clamp-2">{category.description}</div>
                    </Link>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>

            <nav className="flex flex-wrap items-center gap-6 text-sm font-semibold text-roseBrown/80">
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

      {/* ── Drawer (Мобильное меню) ─────────────────────────── */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={closeDrawer} />
        
        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(300px,85vw)] flex-col bg-white transition-transform duration-300 ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header Drawer */}
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sm font-bold text-white">L</span>
              <span className="font-display text-xl font-semibold">Lumina</span>
            </Link>
            <button onClick={closeDrawer} className="p-2 -mr-2"><FiX size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
            {/* Профиль */}
            <NavLink
              to="/profile"
              className="mb-8 flex items-center gap-3 rounded-2xl bg-blush/30 p-3"
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-roseBrown shadow-sm">
                <FiUser size={18} />
              </div>
              <div>
                <div className="text-xs text-roseBrown/60">Личный кабинет</div>
                <div className="text-sm font-bold text-ink">Войти / Профиль</div>
              </div>
              <FiChevronRight size={16} className="ml-auto text-roseBrown/40" />
            </NavLink>

            {/* Навигация */}
            <div className="mb-8">
              <div className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-roseBrown/40">Меню</div>
              <nav className="grid gap-1">
                {siteTexts.nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition ${
                        isActive ? 'bg-ink text-white shadow-md' : 'text-ink active:bg-blush/40'
                      }`
                    }
                  >
                    {item.label}
                    <FiChevronRight size={16} className="opacity-30" />
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Категории */}
            <div>
              <div className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-roseBrown/40">Категории</div>
              <div className="grid gap-2">
                {siteTexts.categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/catalog?category=${category.slug}`}
                    className="flex items-center gap-3 overflow-hidden rounded-xl border border-line p-2 transition active:scale-[0.98]"
                  >
                    <img src={category.image} alt={category.title} className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-ink">{category.title}</div>
                      <div className="truncate text-[10px] text-roseBrown/60">{category.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto border-t border-line p-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-ink"
            >
              <div className="flex items-center gap-3">
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
                <span>{isDark ? 'Светлая тема' : 'Тёмная тема'}</span>
              </div>
              <div className={`h-5 w-10 rounded-full transition-colors relative ${isDark ? 'bg-accent' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${isDark ? 'right-1' : 'left-1'}`} />
              </div>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Header;