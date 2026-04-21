create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.admin_settings enable row level security;
alter table public.orders enable row level security;
alter table public.product_reviews enable row level security;

drop policy if exists "Allow all operations on orders" on public.orders;

drop policy if exists "admin_users_select_own" on public.admin_users;
create policy "admin_users_select_own"
on public.admin_users
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
on public.products
for select
to anon, authenticated
using (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write"
on public.products
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "admin_settings_admin_read" on public.admin_settings;
create policy "admin_settings_admin_read"
on public.admin_settings
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "admin_settings_admin_write" on public.admin_settings;
create policy "admin_settings_admin_write"
on public.admin_settings
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "orders_public_create" on public.orders;
create policy "orders_public_create"
on public.orders
for insert
to anon, authenticated
with check (true);

drop policy if exists "orders_admin_read" on public.orders;
create policy "orders_admin_read"
on public.orders
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
on public.orders
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "orders_admin_delete" on public.orders;
create policy "orders_admin_delete"
on public.orders
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "product_reviews_public_read" on public.product_reviews;
create policy "product_reviews_public_read"
on public.product_reviews
for select
to anon, authenticated
using (true);

drop policy if exists "product_reviews_public_create" on public.product_reviews;
create policy "product_reviews_public_create"
on public.product_reviews
for insert
to anon, authenticated
with check (true);

drop policy if exists "product_reviews_admin_delete" on public.product_reviews;
create policy "product_reviews_admin_delete"
on public.product_reviews
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);
