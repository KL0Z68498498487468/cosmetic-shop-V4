import { useEffect, useState } from 'react';
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

const AdminPage = () => {
  const { isLoggedIn, login, logout, loading, init } = useAdminStore();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [activeTab, setActiveTab] = useState('orders');
  const [orderSearch, setOrderSearch] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [catalogConfig, setCatalogConfig] = useState(null);

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

  const handleProductImageChange = (index, type, file) => {
    setProductImages((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [type]: file
      }
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
        const imageFile = productImages[index]?.primary;
        const imageUrl = imageFile ? await uploadProductImage(imageFile) : product.images.primary || '';

        processedData.products.push({
          ...product,
          id: nanoid(8),
          name_ru: product.name,
          name_uz: product.name,
          images: {
            primary: imageUrl,
            secondary: ''
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
                              <div key={index} className="text-sm border-l-2 border-roseBrown pl-3">
                                <p><strong>ID:</strong> {item.id}</p>
                                <p><strong>Название (RU):</strong> {item.name_ru}</p>
                                <p><strong>Бренд:</strong> {item.brand_line}</p>
                                <p><strong>Цена:</strong> {item.pricing.regular_price} {product.catalog.campaign.currency}</p>
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
                            <input
                              type="file"
                              accept="image/*"
                              className="w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-roseBrown file:text-white"
                              onChange={(event) => {
                                handleProductImageChange(index, 'primary', event.target.files?.[0]);
                              }}
                            />
                            <p className="text-xs text-muted mt-2">Загрузите одно главное фото.</p>
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
    </>
  );
};

export default AdminPage;