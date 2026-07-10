import { Link } from 'react-router-dom';
import { useBlogs } from '@/api/hooks';
import { SEOHead } from '@/components/common/SEOHead';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { usePageHeroContent } from '@/hooks/useSectionContent';

export default function BlogPage() {
  const { data: blogs, isLoading } = useBlogs();
  const hero = usePageHeroContent('blog_page', {
    title: 'Blog',
    subtitle: 'Insights, trends, and best practices.',
  });

  if (isLoading) return <PageLoader />;

  return (
    <>
      <SEOHead title="Blog | TRANS-NET" description="Latest articles and insights from TRANS-NET." />
      <PageHero title={hero.title} subtitle={hero.subtitle} />
      <Container className="py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(blogs || []).map((blog) => (
            <Card key={blog.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-slate-200" />
              <CardBody>
                <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">{blog.excerpt}</p>
                <Link to={`/blog/${blog.slug}`} className="mt-4 inline-block text-sm font-medium text-accent-600">
                  Read more →
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
