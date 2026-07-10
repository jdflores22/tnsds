import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { useSubmitContact } from '@/api/hooks';
import { PageSEO } from '@/components/common/PageSEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { usePageHeroContent, useSectionDarkBackground } from '@/hooks/useSectionContent';
import { sectionSurfaceClass } from '@/utils/sectionSurface';
import { formatWebsiteHref } from '@/utils/media';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(3, 'Subject is required'),
  body: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const mutation = useSubmitContact();
  const { get } = useSiteSettingsMap();
  const hero = usePageHeroContent('contact_page', {
    title: 'Contact Us',
    subtitle: "We'd love to hear about your project.",
  });

  const email = get('company_email', 'info@trans-net.com');
  const phone = get('company_phone', '+1 (555) 123-4567');
  const address = get('company_address', '123 Tech Boulevard, Suite 500');
  const website = get('company_website', 'www.trans-net.com');
  const websiteHref = formatWebsiteHref(website);
  const darkMain = useSectionDarkBackground('contact_main');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data, { onSuccess: () => reset() });
  };

  return (
    <>
      <PageSEO pageKey="contact" title="Contact | TRANS-NET" description="Get in touch with TRANS-NET." />
      <PageHero title={hero.title} subtitle={hero.subtitle} />
      <section className={sectionSurfaceClass(darkMain)}>
        <Container className="py-16">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-medium text-primary-900">Get in Touch</h2>
            <p className="mt-4 text-slate-600">
              Fill out the form and our team will get back to you within 24 hours.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-gold-500" />
                <a href={`mailto:${email}`} className="hover:text-primary-800">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-gold-500" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-primary-800">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-4 w-4 shrink-0 text-brand-gold-500" />
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-800"
                >
                  {website}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-500" />
                <span>{address}</span>
              </li>
            </ul>
          </div>
          <Card>
            <CardBody>
              {mutation.isSuccess && (
                <div className="mb-4 rounded-lg border border-primary-100 bg-primary-50 p-4 text-sm text-primary-800">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              {mutation.isError && (
                <div className="mb-4 rounded-lg border border-brand-red-500/20 bg-brand-red-500/10 p-4 text-sm text-brand-red-700">
                  Failed to send message. Please try again.
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Name" error={errors.name?.message} {...register('name')} />
                <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
                <Input label="Subject" error={errors.subject?.message} {...register('subject')} />
                <Textarea label="Message" rows={5} error={errors.body?.message} {...register('body')} />
                <Button type="submit" className="w-full" isLoading={mutation.isPending}>
                  Send Message
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
        </Container>
      </section>
    </>
  );
}
