import { useForm } from 'react-hook-form';
import { FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button/index.jsx';
import Input from '@/components/common/Input/index.jsx';
import { getSiteTexts } from '@/constants/texts.js';

const Footer = () => {
  const { t } = useTranslation();
  const siteTexts = getSiteTexts(t);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (values) => {
    toast.success(t('toast.subscribed', { email: values.email }));
    reset();
  };

  return (
    <footer className="mt-20 border-t border-white/60 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container-shell py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="rounded-[2rem] bg-ink bg-soft-mesh p-8 text-white shadow-soft dark:bg-slate-900 dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)]">
            <div className="font-display text-4xl">{t('common.newsletterTitle')}</div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">{siteTexts.newsletter}</p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="border-white/20 bg-white/90 text-ink"
                {...register('email', { required: true })}
              />
              <Button type="submit" variant="soft" className="shrink-0">
                {t('footer.subscribe')}
              </Button>
            </form>
          </div>

          <div className="surface-card p-6">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-roseBrown/70 dark:text-slate-400">
              {t('common.company')}
            </div>
            <div className="mt-5 space-y-3">
              {siteTexts.footerLinks.company.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block text-sm transition hover:translate-x-0.5 hover:text-accent dark:text-slate-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-roseBrown/70 dark:text-slate-400">
              {t('common.contactSection')}
            </div>
            <div className="mt-5 space-y-3 text-sm text-roseBrown/80 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <FiPhone /> +998 71 202 00 77
              </div>
              <div className="flex items-center gap-3">
                <FiMail /> hello@lumina-demo.uz
              </div>
              <div className="flex items-center gap-3">
                <FiMapPin /> {t('common.address')}
              </div>
              <div className="flex items-center gap-3">
                <FiInstagram /> @lumina.beauty
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
