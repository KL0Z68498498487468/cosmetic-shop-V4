import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Breadcrumbs from '@/components/common/Breadcrumbs/index.jsx';
import Button from '@/components/common/Button/index.jsx';
import Input from '@/components/common/Input/index.jsx';
import Seo from '@/components/common/Seo/index.jsx';

const ContactsPage = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '', email: '', message: '' }
  });

  return (
    <>
      <Seo title={`${t('common.contacts')} | Lumina`} />
      <div className="container-shell py-8">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('common.contacts') }]} />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="surface-card overflow-hidden">
            <iframe
              title={t('contactsPage.mapTitle')}
              src="https://maps.google.com/maps?q=Tashkent&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-[320px] w-full border-0 sm:h-[420px] lg:h-[520px]"
              loading="lazy"
            />
          </div>

          <div className="surface-card p-5 sm:p-8">
            <h1 className="section-title">{t('contactsPage.title')}</h1>
            <div className="mt-5 space-y-2 text-muted">
              <p>{t('contactsPage.phone')}: +998 71 202 00 77</p>
              <p>{t('contactsPage.email')}: hello@lumina-demo.uz</p>
              <p>{t('contactsPage.address')}: {t('common.address')}</p>
            </div>
            <form
              onSubmit={handleSubmit((values) => {
                toast.success(t('toast.messageSent', { name: values.name }));
                reset();
              })}
              className="mt-8 space-y-4"
            >
              <Input label={t('common.yourName')} {...register('name')} />
              <Input label={t('common.email')} {...register('email')} />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink dark:text-slate-200">{t('common.message')}</span>
                <textarea
                  {...register('message')}
                  rows="5"
                  className="focus-ring w-full rounded-2xl border border-line bg-white px-4 py-3 text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
              <Button type="submit" className="w-full">
                {t('common.send')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactsPage;
