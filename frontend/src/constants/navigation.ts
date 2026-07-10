import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Briefcase,
  Building2,
  Factory,
  FileText,
  FolderKanban,
  HelpCircle,
  Home,
  Layers,
  ListOrdered,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Package,
  Settings,
  Shield,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
}

export const mainNavLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Technologies', href: '/technologies' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
];

export const footerNavLinks: NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

export interface AdminNavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  label: string;
  links: AdminNavLink[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: 'Overview',
    links: [{ label: 'Dashboard', href: '/admin', icon: Home }],
  },
  {
    label: 'Content',
    links: [
      { label: 'Services', href: '/admin/services', icon: Wrench },
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Industries', href: '/admin/industries', icon: Factory },
      { label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
      { label: 'Stats', href: '/admin/stats', icon: BarChart3 },
      { label: 'Why choose us', href: '/admin/highlights', icon: Sparkles },
      { label: 'Process steps', href: '/admin/process-steps', icon: ListOrdered },
      { label: 'Technologies', href: '/admin/technologies', icon: Layers },
      { label: 'Portfolio', href: '/admin/portfolio', icon: Briefcase },
      { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
      { label: 'Clients', href: '/admin/clients', icon: Building2 },
      { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
      { label: 'Blog', href: '/admin/blog', icon: Newspaper },
      { label: 'Careers', href: '/admin/careers', icon: Users },
    ],
  },
  {
    label: 'Engagement',
    links: [{ label: 'Messages', href: '/admin/messages', icon: Mail }],
  },
  {
    label: 'System',
    links: [
      { label: 'Users', href: '/admin/users', icon: Shield },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'SEO', href: '/admin/seo', icon: FileText },
    ],
  },
];

/** @deprecated use adminNavGroups */
export const adminNavLinks: AdminNavLink[] = adminNavGroups.flatMap((g) => g.links);

export const adminPageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/projects': 'Projects',
  '/admin/services': 'Services',
  '/admin/products': 'Software products',
  '/admin/industries': 'Sector expertise',
  '/admin/faq': 'FAQ',
  '/admin/stats': 'Homepage stats',
  '/admin/highlights': 'Why choose us',
  '/admin/process-steps': 'Process steps',
  '/admin/technologies': 'Technologies',
  '/admin/portfolio': 'Portfolio',
  '/admin/clients': 'Clients',
  '/admin/testimonials': 'Testimonials',
  '/admin/blog': 'Blog',
  '/admin/messages': 'Messages',
  '/admin/careers': 'Careers',
  '/admin/users': 'Users',
  '/admin/settings': 'Settings',
  '/admin/seo': 'SEO',
};
