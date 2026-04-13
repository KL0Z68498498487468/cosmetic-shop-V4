import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Seo from '@/components/common/Seo/index.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import Button from '@/components/common/Button/index.jsx';
import Input from '@/components/common/Input/index.jsx';

const ContactsPage = () => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '', email: '', message: '' }
  });

  return (
    <>
      <Seo title="Контакты | Lumina" />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Контакты' }]} />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-soft">
            <iframe
              title="Карта Lumina"
              src="https://maps.google.com/maps?q=Tashkent&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-[520px] w-full border-0"
              loading="lazy"
            />
          </div>

          <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
            <h1 className="section-title">Контакты</h1>
            <div className="mt-5 space-y-2 text-muted">
              <p>Телефон: +998 71 202 00 77</p>
              <p>Email: hello@lumina-demo.uz</p>
              <p>Адрес: Ташкент, ул. Сайрам, 24</p>
            </div>
            <form
              onSubmit={handleSubmit((values) => {
                toast.success(`Сообщение отправлено, ${values.name}`);
                reset();
              })}
              className="mt-8 space-y-4"
            >
              <Input label="Имя" {...register('name')} />
              <Input label="Email" {...register('email')} />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">Сообщение</span>
                <textarea
                  {...register('message')}
                  rows="5"
                  className="w-full rounded-2xl border border-line px-4 py-3"
                />
              </label>
              <Button type="submit" className="w-full">
                Отправить
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactsPage;
