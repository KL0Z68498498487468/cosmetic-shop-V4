import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';

const DeliveryPage = () => {
  return (
    <>
      <Seo title="Доставка и оплата | Lumina" />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Доставка и оплата' }]} />
        <div className="mt-6 rounded-[2.5rem] bg-white p-8 shadow-soft">
          <h1 className="section-title">Доставка и оплата</h1>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Самовывоз',
                text: 'Бесплатно. Готовность заказа в течение 2 часов после подтверждения.'
              },
              {
                title: 'Курьер',
                text: 'По Ташкенту день в день. Бесплатно от 250 000 сум, иначе 25 000 сум.'
              },
              {
                title: 'Постамат',
                text: 'Удобно для занятых клиентов. Средний срок доставки 1-2 дня.'
              }
            ].map((item) => (
              <div key={item.title} className="rounded-[2rem] bg-pearl p-6">
                <div className="text-xl font-semibold text-ink">{item.title}</div>
                <p className="mt-3 text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryPage;
