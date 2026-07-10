import { Link, useParams } from 'react-router-dom';
import { useBlog } from '@/api/hooks';
import { SEOHead } from '@/components/common/SEOHead';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { PageLoader } from '@/components/ui/Spinner';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, isError } = useBlog(slug || '');

  if (isLoading) return <PageLoader />;
  if (isError || !blog) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-accent-600">Back to blog</Link>
      </Container>
    );
  }

  return (
    <>
      <SEOHead
        title={blog.seoTitle || `${blog.title} | TRANS-NET Blog`}
        description={blog.seoDescription || blog.excerpt}
      />
      <PageHero title={blog.title} subtitle={blog.excerpt} />
      <Container className="py-16">
        <article className="prose prose-slate mx-auto max-w-3xl">
          <div className="whitespace-pre-wrap text-slate-700">{blog.content}</div>
        </article>
      </Container>
    </>
  );
}
