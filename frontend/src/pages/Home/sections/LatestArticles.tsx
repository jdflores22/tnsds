import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useBlogs } from '@/api/hooks';
import { Container } from '@/components/common/Container';
import { PageSection } from '@/components/common/SectionHeading';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Spinner } from '@/components/ui/Spinner';
import { useSectionContent, usePageSectionTheme } from '@/hooks/useSectionContent';

export function LatestArticles() {
  const { data: blogs, isLoading } = useBlogs({ limit: 4 });
  const items = blogs?.slice(0, 4) ?? [];
  const section = useSectionContent('home_blog', {
    eyebrow: 'Insights',
    title: 'Latest from our team',
    subtitle: 'Practical perspectives on software delivery, architecture, and product development.',
  });

  const theme = usePageSectionTheme('home_blog');

  if (!isLoading && items.length === 0) return null;

  return (
    <PageSection sectionId="home_blog" variant="white">
      <Container>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            subtitle={section.subtitle}
            align="left"
            className="mb-0 max-w-2xl"
            showAccent={false}
            theme={theme}
          />
          <Link
            to="/blog"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary-800 hover:text-brand-gold-600"
          >
            All articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : items.length === 0 ? null : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((blog, i) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="pro-card group flex flex-col p-6"
              >
                <p className="text-xs font-semibold tabular-nums text-slate-400">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-primary-900 group-hover:text-brand-gold-600">
                  {blog.title}
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">{blog.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-800">
                  Read article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </PageSection>
  );
}
