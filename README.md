# Lumina Beauty Store

Косметический магазин на React + Vite.

## Особенности

- Анонимные заказы (без регистрации пользователей)
- Админ-панель для просмотра заказов
- Интеграция с Supabase для хранения данных

## Настройка

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Настройте переменные окружения в `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   VITE_TELEGRAM_CHAT_ID=your_telegram_chat_id
   ```

3. Создайте таблицу `orders` в Supabase, выполнив SQL из `create_orders_table.sql`

4. Запустите проект:
   ```bash
   npm run dev
   ```

## Админ-панель

- URL: `/admin`
- Авторизация через Supabase Auth (нужен аккаунт администратора в Supabase)

В админке можно просмотреть все оформленные заказы и управлять каталогами товаров.
