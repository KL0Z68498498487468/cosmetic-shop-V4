import { useEffect, useRef, useCallback, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import Seo from '@/components/common/Seo/index.jsx';
import Button from '@/components/common/Button/index.jsx';
import Input from '@/components/common/Input/index.jsx';
import { useAdminStore } from '@/store/adminStore.js';
import { supabase } from '@/lib/supabaseClient.js';

const loginSchema = yup.object({
  email: yup.string().email('Некорректный email').required('Введите email'),
  password: yup.string().required('Введите пароль')
});

const productSchema = yup.object({
  products: yup.array().of(
    yup.object({
      name: yup.string().required('Введите название товара'),
      brand_line: yup.string(),
      type: yup.string(),
      volume: yup.string(),
      images: yup.object({
        primary: yup.string().nullable()
      }),
      pricing: yup.object({
        regular_price: yup.number().positive('Цена должна быть положительной').required('Введите цену')
      }),
      availability: yup.object({
        in_stock: yup.boolean(),
        is_limited_edition: yup.boolean()
      }),
      description_ru: yup.string(),
      category_path: yup.string(),
      actions: yup.string(),
      attributes: yup.string()
    })
  ).min(1, 'Добавьте хотя бы один товар')
});

/* ── Drag-and-drop зона для загрузки нескольких фото ─────────── */
const ImageDropZone = ({ files, onChange }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback((newFiles) => {
    const validFiles = Array.from(newFiles).filter((f) => f.type.startsWith('image/'));
    if (!validFiles.length) return;
    onChange((prev) => [...prev, ...validFiles]);
  }, [onChange]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (idx) => {
    onChange((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-accent bg-accent/5'
            : 'border-line hover:border-accent/60 dark:border-slate-700'
        }`}
      >
        <div className="text-3xl">📷</div>
        <p className="text-sm font-medium text-ink dark:text-slate-200">
          Перетащите фото сюда или нажмите для выбора
        </p>
        <p className="text-xs text-roseBrown/60 dark:text-slate-400">
          Первое фото — главное, остальные — галерея
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Preview thumbnails */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {files.map((file, idx) => (
            <div key={idx} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`фото ${idx + 1}`}
                className={`h-24 w-24 rounded-xl object-cover ring-2 ${
                  idx === 0 ? 'ring-accent' : 'ring-line dark:ring-slate-700'
                }`}
              />
              {idx === 0 && (
                <span className="absolute -top-2 left-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
                  Главное
                </span>
              )}
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] text-white shadow hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminPage = () => {
  const { isLoggedIn, login, logout, loading, init } = useAdminStore();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  // productImages[index] = File[] (первый файл — primary, остальные — gallery)
  const [productImages, setProductImages] = useState({});
  const [activeTab, setActiveTab] = useState('orders');
  const [orderSearch, setOrderSearch] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [catalogConfig, setCatalogConfig] = useState(null);

  // Редактирование товара
  const [editingItem, setEditingItem] = useState(null); // { catalogId, productIdx, product }
  const [editImages, setEditImages] = useState([]);     // Новые File[] для замены фото
  const [isEditSaving, setIsEditSaving] = useState(false);

  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const productForm = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      products: [{
        name: '',
        brand_line: '',
        type: '',
        volume: '',
        images: { primary: '' },
        pricing: { regular_price: 0 },
        availability: { in_stock: true, is_limited_edition: false },
        description_ru: '',
        category_path: '',
        actions: '',
        attributes: ''
      }]
    }
  });

  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control: productForm.control,
    name: 'products'
  });

  const editForm = useForm({
    defaultValues: {
      name: '', brand_line: '', type: '', volume: '',
      regular_price: 0, discount_percent: 0,
      description_ru: '', category_path: '',
      in_stock: true, top_day: false, top_week: false
    }
  });

  const handleProductImagesChange = (index, updater) => {
    setProductImages((prev) => ({
      ...prev,
      [index]: typeof updater === 'function' ? updater(prev[index] || []) : updater
    }));
  };

  const uploadProductImage = async (file) => {
    if (!file) return '';

    const extension = file.name.split('.').pop();
    const filename = `${nanoid(10)}.${extension}`;
    const filePath = `product-images/${filename}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (isLoggedIn) {
      loadOrders();
      loadProducts();
      loadCatalogConfig();
    }
  }, [isLoggedIn]);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading orders:', error);
        toast.error('Ошибка при загрузке заказов');
        return;
      }

      setOrders(data || []);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Ошибка при загрузке заказов');
    }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading products:', error);
        toast.error('Ошибка при загрузке товаров');
        return;
      }

      setProducts(data || []);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Ошибка при загрузке товаров');
    }
  };

  const loadCatalogConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('campaign_number, campaign_year, campaign_country, campaign_currency')
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Error loading catalog config:', error);
        }
        return;
      }

      setCatalogConfig({
        number: data.campaign_number,
        year: data.campaign_year,
        country: data.campaign_country,
        currency: data.campaign_currency
      });
    } catch (err) {
      console.error('Error loading catalog config:', err);
    }
  };

  const onLoginSubmit = async (values) => {
    await login(values);
  };

  const onProductSubmit = async (values) => {
    try {
      if (!catalogConfig) {
        toast.error('Не удалось загрузить настройки кампании. Сначала заполните admin_settings в Supabase.');
        return;
      }

      const processedData = {
        campaign: catalogConfig,
        products: []
      };

      for (const [index, product] of values.products.entries()) {
        const regularPrice = Number(product.pricing.regular_price) || 0;
        const premierPrice = regularPrice;
        const imageFiles = productImages[index] || [];

        // Загружаем все фото параллельно
        const uploadedUrls = imageFiles.length > 0
          ? await Promise.all(imageFiles.map((f) => uploadProductImage(f)))
          : [];

        const imageUrl = uploadedUrls[0] || product.images.primary || '';
        const galleryUrls = uploadedUrls.slice(1);

        processedData.products.push({
          ...product,
          id: nanoid(8),
          name_ru: product.name,
          name_uz: product.name,
          images: {
            primary: imageUrl,
            secondary: galleryUrls[0] || '',
            gallery: galleryUrls
          },
          pricing: {
            regular_price: regularPrice,
            premier_price: premierPrice,
            discount_percent: 0,
            bonus_points: 0
          },
          availability: {
            in_stock: product.availability?.in_stock ?? true,
            is_limited_edition: product.availability?.is_limited_edition ?? false
          },
          description_ru: product.description_ru || '',
          fragrance_notes: product.attributes ? product.attributes.split(',').map((s) => s.trim()).filter(Boolean) : [],
          category_path: product.category_path
            ? product.category_path.split(',').map((name) => ({ name_ru: name.trim() })).filter((item) => item.name_ru)
            : [],
          actions: product.actions ? product.actions.split(',').map((s) => s.trim()).filter(Boolean) : [],
          seo: {
            keywords_ru: [product.name, product.brand_line, product.type].filter(Boolean),
            keywords_uz: [product.name, product.brand_line, product.type].filter(Boolean)
          },
          specifications: {
            texture: '',
            skin_type: [],
            effect: []
          }
        });
      }

      const { error } = await supabase
        .from('products')
        .insert([{ catalog: processedData }])
        .select();

      if (error) {
        console.error('Error adding product:', error);
        toast.error('Ошибка при добавлении товара');
        return;
      }

      toast.success('Товар успешно добавлен');
      productForm.reset();
      setProductImages({});
      loadProducts();
    } catch (err) {
      console.error('Error:', err);
      toast.error('Ошибка при обработке данных');
    }
  };

  const deleteCatalog = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот каталог?')) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting catalog:', error);
        toast.error('Ошибка при удалении каталога');
        return;
      }

      toast.success('Каталог удалён');
      loadProducts();
    } catch (err) {
      console.error('Error:', err);
      toast.error('Ошибка при удалении');
    }
  };

  /* ─── Редактирование товара ───────────────────────────── */
  const openEditProduct = (catalogId, productIdx, product) => {
    setEditingItem({ catalogId, productIdx, product });
    setEditImages([]);
    editForm.reset({
      name:            product.name_ru || product.name || '',
      brand_line:      product.brand_line || '',
      type:            product.type || '',
      volume:          product.volume || '',
      regular_price:   product.pricing?.regular_price || 0,
      discount_percent: product.pricing?.discount_percent || 0,
      description_ru:  product.description_ru || '',
      category_path:   Array.isArray(product.category_path)
        ? product.category_path.map((c) => c.name_ru || c).join(', ')
        : product.category_path || '',
      in_stock:  product.availability?.in_stock ?? true,
      top_day:   product.top_day  ?? false,
      top_week:  product.top_week ?? false
    });
  };

  const saveEditProduct = async (values) => {
    if (!editingItem) return;
    setIsEditSaving(true);
    try {
      const catalogRow = products.find((p) => p.id === editingItem.catalogId);
      if (!catalogRow) throw new Error('Каталог не найден');

      // Загрузка новых фото если выбраны
      let uploadedUrls = [];
      if (editImages.length > 0) {
        uploadedUrls = await Promise.all(editImages.map((f) => uploadProductImage(f)));
      }

      const old = editingItem.product;
      const updatedProduct = {
        ...old,
        name_ru:    values.name,
        name_uz:    values.name,
        name:       values.name,
        brand_line: values.brand_line,
        type:       values.type,
        volume:     values.volume,
        description_ru: values.description_ru,
        pricing: {
          ...old.pricing,
          regular_price:   Number(values.regular_price) || 0,
          premier_price:   Number(values.regular_price) || 0,
          discount_percent: Number(values.discount_percent) || 0
        },
        availability: { ...old.availability, in_stock: values.in_stock },
        top_day:  values.top_day,
        top_week: values.top_week,
        category_path: values.category_path
          ? values.category_path.split(',').map((s) => ({ name_ru: s.trim() })).filter((i) => i.name_ru)
          : old.category_path || [],
        images: uploadedUrls.length > 0
          ? { primary: uploadedUrls[0], secondary: uploadedUrls[1] || old.images?.secondary || '', gallery: uploadedUrls.slice(1) }
          : old.images
      };

      const updatedCatalogProducts = [...catalogRow.catalog.products];
      updatedCatalogProducts[editingItem.productIdx] = updatedProduct;

      const { error } = await supabase
        .from('products')
        .update({ catalog: { ...catalogRow.catalog, products: updatedCatalogProducts } })
        .eq('id', editingItem.catalogId);

      if (error) throw error;

      toast.success('Товар обновлён');
      setEditingItem(null);
      loadProducts();
    } catch (err) {
      console.error('Error saving edit:', err);
      toast.error('Ошибка при сохранении');
    } finally {
      setIsEditSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Seo title="Админка | Lumina" description="Панель администратора" />
        <div className="container-shell py-10 sm:py-14">
          <div className="mx-auto max-w-xl">
            <div className="surface-card p-8 sm:p-10">
              <div className="text-sm font-bold uppercase tracking-[0.28em] text-roseBrown/60 dark:text-slate-400">
                Админка
              </div>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink dark:text-slate-100">
                Вход
              </h1>
              <p className="mt-3 text-muted">
                Введите email и пароль администратора.
              </p>

              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="mt-8 grid gap-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="admin@lumina.com"
                  autoComplete="email"
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register('email')}
                />
                <Input
                  label="Пароль"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  error={loginForm.formState.errors.password?.message}
                  {...loginForm.register('password')}
                />

                <div className="mt-2">
                  <Button type="submit" disabled={loginForm.formState.isSubmitting || loading} className="w-full">
                    {loginForm.formState.isSubmitting || loading ? 'Входим…' : 'Войти'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title="Админка | Lumina" description="Панель администратора" />
      <div className="container-shell py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink dark:text-slate-100">
            Админка
          </h1>
          <Button onClick={logout} variant="outline">
            Выйти
          </Button>
        </div>

        <div className="mt-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-roseBrown text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Заказы
            </button>
            <button
              onClick={() => setActiveTab('catalogs')}
              className={`px-4 py-2 rounded ${activeTab === 'catalogs' ? 'bg-roseBrown text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Каталоги
            </button>
            <button
              onClick={() => setActiveTab('add-product')}
              className={`px-4 py-2 rounded ${activeTab === 'add-product' ? 'bg-roseBrown text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Добавить товар
            </button>
          </div>

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-semibold text-ink dark:text-slate-100 mb-4">
                Заказы
              </h2>
              <div className="mb-4">
                <Input
                  label="Поиск по email или имени"
                  placeholder="Введите email или имя..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
                <Button onClick={loadOrders} variant="outline" className="mt-2">
                  Обновить
                </Button>
              </div>
              {orders.length === 0 ? (
                <p className="text-muted">Нет заказов</p>
              ) : (
                <div className="space-y-4">
                  {orders
                    .filter(order =>
                      order.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
                      order.name.toLowerCase().includes(orderSearch.toLowerCase())
                    )
                    .map((order) => (
                      <div key={order.id} className="surface-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-ink dark:text-slate-100">
                              Заказ #{order.id}
                            </h3>
                            <p className="text-sm text-muted">{new Date(order.created_at).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-ink dark:text-slate-100">
                              {order.total} {order.currency || '₽'}
                            </p>
                            <p className="text-sm text-muted">{order.payment}</p>
                          </div>
                        </div>
                        <div className="grid gap-2 mb-4">
                          <p><strong>Имя:</strong> {order.name}</p>
                          <p><strong>Email:</strong> {order.email}</p>
                          <p><strong>Телефон:</strong> {order.phone}</p>
                          <p><strong>Доставка:</strong> {order.delivery}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Товары:</h4>
                          <ul className="space-y-1">
                            {order.items && order.items.map((item, index) => (
                              <li key={index} className="text-sm">
                                Продукт ID: {item.productId}, Вариант: {item.variant}, Кол-во: {item.quantity}, Цена: {item.price} {order.currency || '₽'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'catalogs' && (
            <div>
              <h2 className="text-2xl font-semibold text-ink dark:text-slate-100 mb-4">
                Каталоги товаров
              </h2>

              <div>
                <h3 className="text-xl font-semibold mb-4">Существующие каталоги</h3>
                {products.length === 0 ? (
                  <p className="text-muted">Нет товаров</p>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="surface-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-ink dark:text-slate-100">
                              Каталог #{product.catalog.campaign.number} {product.catalog.campaign.year}
                            </h4>
                            <p className="text-sm text-muted">
                              {product.catalog.campaign.country} - {product.catalog.campaign.currency}
                            </p>
                            <p className="text-sm text-muted">
                              Создан: {new Date(product.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => deleteCatalog(product.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                            >
                              Удалить
                            </Button>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold mb-2">Товары:</h5>
                          <div className="space-y-2">
                            {product.catalog.products.map((item, index) => (
                              <div key={index} className="flex items-start gap-3 rounded-xl border border-line p-3 dark:border-slate-700">
                                {/* Миниатюра фото */}
                                {item.images?.primary && (
                                  <img
                                    src={item.images.primary}
                                    alt={item.name_ru}
                                    className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                                  />
                                )}
                                {/* Инфо */}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-ink dark:text-slate-100 truncate">{item.name_ru}</p>
                                  <p className="text-xs text-muted">{item.brand_line}</p>
                                  <p className="text-xs text-muted">{item.pricing?.regular_price?.toLocaleString()} {product.catalog.campaign.currency}</p>
                                  {(item.top_day || item.top_week) && (
                                    <div className="mt-1 flex gap-1">
                                      {item.top_day  && <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">Топ дня</span>}
                                      {item.top_week && <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600 dark:bg-violet-900/30 dark:text-violet-300">Топ недели</span>}
                                    </div>
                                  )}
                                </div>
                                {/* Кнопка */}
                                <button
                                  type="button"
                                  onClick={() => openEditProduct(product.id, index, item)}
                                  className="flex-shrink-0 rounded-lg border border-line px-3 py-1.5 text-xs font-medium hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-300 transition"
                                >
                                  Редактировать
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'add-product' && (
            <div>
              <h2 className="text-2xl font-semibold text-ink dark:text-slate-100 mb-4">
                Добавить каталог товаров
              </h2>

              <div className="surface-card p-6 mb-6">
                <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-6">
                  {/* Products Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold">Товары</h4>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => appendProduct({
                          name: '',
                          brand_line: '',
                          type: '',
                          volume: '',
                          images: { primary: '' },
                          pricing: { regular_price: 0 },
                          availability: { in_stock: true, is_limited_edition: false },
                          description_ru: '',
                          category_path: '',
                          actions: '',
                          attributes: ''
                        })}
                      >
                        Добавить товар
                      </Button>
                    </div>

                    {productFields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold">Товар #{index + 1}</h5>
                          {productFields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeProduct(index)}
                            >
                              Удалить
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Название товара"
                            placeholder="Скраб для тела..."
                            error={productForm.formState.errors.products?.[index]?.name?.message}
                            {...productForm.register(`products.${index}.name`)}
                          />
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Фото товара</label>
                            <ImageDropZone
                              files={productImages[index] || []}
                              onChange={(updater) => handleProductImagesChange(index, updater)}
                            />
                          </div>
                          <Input
                            label="Цена"
                            type="number"
                            placeholder="258000"
                            error={productForm.formState.errors.products?.[index]?.pricing?.regular_price?.message}
                            {...productForm.register(`products.${index}.pricing.regular_price`)}
                          />
                          <div className="md:col-span-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowDetails((prev) => !prev)}
                            >
                              {showDetails ? 'Скрыть детали' : 'Добавить детали'}
                            </Button>
                          </div>

                          {showDetails && (
                            <div className="md:col-span-2 border rounded-lg p-4 bg-white dark:bg-slate-900">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                  label="Бренд"
                                  placeholder="Essense & Co."
                                  {...productForm.register(`products.${index}.brand_line`)}
                                />
                                <Input
                                  label="Категория (через запятую)"
                                  placeholder="body_care, scrubs"
                                  {...productForm.register(`products.${index}.category_path`)}
                                />
                                <Input
                                  label="Тип товара"
                                  placeholder="body_scrub"
                                  {...productForm.register(`products.${index}.type`)}
                                />
                                <Input
                                  label="Объем"
                                  placeholder="250 мл"
                                  {...productForm.register(`products.${index}.volume`)}
                                />
                                <Input
                                  label="Характеристики / теги"
                                  placeholder="натурально, для всех типов кожи"
                                  {...productForm.register(`products.${index}.attributes`)}
                                />
                                <Input
                                  label="Доп. опции (через запятую)"
                                  placeholder="exfoliate, moisturize"
                                  {...productForm.register(`products.${index}.actions`)}
                                />
                                <div className="flex items-center space-x-4 md:col-span-2">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`in_stock_${index}`}
                                      defaultChecked
                                      {...productForm.register(`products.${index}.availability.in_stock`)}
                                    />
                                    <label htmlFor={`in_stock_${index}`}>В наличии</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`is_limited_edition_${index}`}
                                      {...productForm.register(`products.${index}.availability.is_limited_edition`)}
                                    />
                                    <label htmlFor={`is_limited_edition_${index}`}>Ограниченная серия</label>
                                  </div>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium mb-2">Описание (RU)</label>
                                  <textarea
                                    className="w-full h-24 p-3 border rounded-md resize-none"
                                    placeholder="Оставляет на коже лёгкий аромат..."
                                    {...productForm.register(`products.${index}.description_ru`)}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="mt-6">
                      <Button type="submit" disabled={productForm.formState.isSubmitting}>
                        {productForm.formState.isSubmitting ? 'Добавляем…' : 'Добавить товары'}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* ══ ПАНЕЛЬ РЕДАКТИРОВАНИЯ ТОВАРА ══════════════════════════ */}
      {editingItem && (
        <>
          {/* Оверлей */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditingItem(null)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl dark:bg-slate-900 overflow-y-auto">
            {/* Шапка */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-ink dark:text-slate-100">
                Редактировать товар
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-2xl leading-none text-roseBrown/50 hover:text-roseBrown dark:text-slate-400"
              >
                ×
              </button>
            </div>

            {/* Форма */}
            <form
              onSubmit={editForm.handleSubmit(saveEditProduct)}
              className="flex flex-1 flex-col gap-5 px-6 py-6"
            >
              {/* Существующие фото */}
              {editingItem.product.images?.primary && (
                <div>
                  <p className="mb-2 text-sm font-medium text-ink dark:text-slate-200">Текущие фото</p>
                  <div className="flex flex-wrap gap-2">
                    {[editingItem.product.images.primary, ...(editingItem.product.images.gallery || [])].filter(Boolean).map((url, i) => (
                      <img key={i} src={url} alt={`фото ${i + 1}`} className="h-20 w-20 rounded-xl object-cover" />
                    ))}
                  </div>
                </div>
              )}

              {/* Новые фото (заменяют текущие) */}
              <div>
                <p className="mb-2 text-sm font-medium text-ink dark:text-slate-200">
                  Заменить фото <span className="text-xs text-roseBrown/60">(оставьте пустым — сохранятся старые)</span>
                </p>
                <ImageDropZone
                  files={editImages}
                  onChange={setEditImages}
                />
              </div>

              <Input label="Название" {...editForm.register('name')} />
              <Input label="Бренд" {...editForm.register('brand_line')} />

              <div className="grid grid-cols-2 gap-4">
                <Input label="Тип" {...editForm.register('type')} />
                <Input label="Объём" {...editForm.register('volume')} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Цена" type="number" {...editForm.register('regular_price')} />
                <Input label="Скидка %" type="number" {...editForm.register('discount_percent')} />
              </div>

              <Input label="Категории (через запятую)" {...editForm.register('category_path')} />

              <div>
                <label className="mb-2 block text-sm font-medium text-ink dark:text-slate-200">Описание</label>
                <textarea
                  rows={4}
                  className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  {...editForm.register('description_ru')}
                />
              </div>

              {/* Флаги слайдеров */}
              <div className="rounded-2xl border border-line p-4 dark:border-slate-700 space-y-3">
                <p className="text-sm font-semibold text-ink dark:text-slate-200">Слайдеры</p>
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" className="h-4 w-4 accent-accent" {...editForm.register('in_stock')} />
                  <span className="text-sm text-ink dark:text-slate-300">В наличии</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" className="h-4 w-4 accent-accent" {...editForm.register('top_day')} />
                  <span className="text-sm text-ink dark:text-slate-300">
                    Топ дня <span className="text-xs text-roseBrown/60">(«Быстро разбирают»)</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" className="h-4 w-4 accent-accent" {...editForm.register('top_week')} />
                  <span className="text-sm text-ink dark:text-slate-300">
                    Топ недели <span className="text-xs text-roseBrown/60">(«Любимцы покупателей»)</span>
                  </span>
                </label>
              </div>

              {/* Кнопки */}
              <div className="mt-auto flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={isEditSaving}>
                  {isEditSaving ? 'Сохраняем…' : 'Сохранить'}
                </Button>
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setEditingItem(null)}>
                  Отмена
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default AdminPage;