import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useDeferredValue, useMemo, useState } from 'react';
import { FiHeart, FiMoon, FiSearch, FiShoppingBag, FiSun, FiUser } from 'react-icons/fi';
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
  const deferredQuery = useDeferredValue(query);
  const { data: products = [] } = useProducts();
  const { ids } = useWishlist(products);
  const cartItemsCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const { isDark, toggleTheme } = useThemeStore();

  const searchResults = useMemo(() => {
    if (!deferredQuery.trim()) {
      return [];
    }

    return products
      .filter((product) =>
        `${product.name} ${product.brand}`.toLowerCase().includes(deferredQuery.toLowerCase())
      )
      .slice(0, 4);
  }, [deferredQuery, products]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="container-shell py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-lg font-bold text-white">
                L
              </span>
              <div>
                <div className="font-display text-3xl font-semibold leading-none">Lumina</div>
                <div className="text-xs uppercase tracking-[0.24em] text-roseBrown/70">
                  beauty store
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-accent lg:hidden"
            >
              {isDark ? <FiSun /> : <FiMoon />}
            </button>
          </div>

          <div className="relative flex-1">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Найти парфюм, сыворотку, бренд..."
              className="pr-12"
            />
            <FiSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-roseBrown/70" />
            {searchResults.length ? (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] rounded-[1.5rem] border border-line bg-white p-3 shadow-soft">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      setQuery('');
                      navigate(`/catalog/${product.slug}`);
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-blush/60"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                    <div>
                      <div className="font-semibold text-ink">{product.name}</div>
                      <div className="text-xs text-roseBrown/70">{product.brand}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-accent lg:grid"
            >
              {isDark ? <FiSun /> : <FiMoon />}
            </button>
            <NavLink to="/profile" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-accent">
              <FiUser />
            </NavLink>
            <NavLink to="/wishlist" className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-accent">
              <FiHeart />
              {ids.length ? (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {ids.length}
                </span>
              ) : null}
            </NavLink>
            <NavLink to="/cart" className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-accent">
              <FiShoppingBag />
              {cartItemsCount ? (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-white">
                  {cartItemsCount}
                </span>
              ) : null}
            </NavLink>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
                    <img
                      src={category.image}
                      alt={category.title}
                      className="h-32 w-full rounded-[1.25rem] object-cover"
                    />
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
  );
};

export default Header;
