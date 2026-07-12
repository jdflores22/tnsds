import { Target, Eye } from 'lucide-react';
import { useSiteStats } from '@/api/hooks';
import { PageSEO } from '@/components/common/PageSEO';
import {
  AboutStatementSection,
  parseImagePosition,
} from '@/components/marketing/AboutStatementSection';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { useAboutSectionsVisibility } from '@/hooks/useSectionContent';
import { resolveMediaUrl } from '@/utils/media';
import { AboutHero } from '@/pages/About/sections/AboutHero';
import { AboutStorySection } from '@/pages/About/sections/AboutStorySection';
import { AboutStatsSection } from '@/pages/About/sections/AboutStatsSection';
import { AboutWhySection } from '@/pages/About/sections/AboutWhySection';
import { AboutProcessSection } from '@/pages/About/sections/AboutProcessSection';
import { AboutIndustriesSection } from '@/pages/About/sections/AboutIndustriesSection';
import { AboutProductsPromo } from '@/pages/About/sections/AboutProductsPromo';
import { AboutCTASection } from '@/pages/About/sections/AboutCTASection';

export default function AboutPage() {
  const { get } = useSiteSettingsMap();
  const sections = useAboutSectionsVisibility();
  const { data: siteStats } = useSiteStats();

  const companyName = get('company_name', 'TRANS-NET');
  const heroImage = resolveMediaUrl(get('about_hero_image') || '');
  const storyImage = resolveMediaUrl(get('about_story_image') || '') || undefined;

  const mission = get(
    'about_mission',
    'Deliver reliable, scalable custom software that solves real business problems and creates lasting value for every client we serve.',
  );
  const vision = get(
    'about_vision',
    'Be the technology partner organizations trust for innovation, quality engineering, and long-term growth.',
  );
  const missionImage = resolveMediaUrl(get('about_mission_image') || '');
  const visionImage = resolveMediaUrl(get('about_vision_image') || '');
  const missionImagePosition = parseImagePosition(get('about_mission_image_position'), 'right');
  const visionImagePosition = parseImagePosition(get('about_vision_image_position'), 'left');

  const storyEyebrow = get('about_story_eyebrow', 'Our story');
  const storyTitle = get(
    'about_story_title',
    'From focused software studio to trusted development partner',
  );
  const intro = get(
    'about_intro',
    'TRANS-NET is a software development company specializing in custom enterprise applications, web and mobile products, and long-term software support.',
  );
  const secondary = get(
    'about_secondary',
    'With over a decade of experience, we have helped organizations across healthcare, finance, logistics, and more achieve their technology goals through innovative, scalable software. Our path has been shaped by the same challenges our clients face — evolving requirements, new markets, and the need to integrate modern tools without disrupting operations.',
  );

  const showHeroStatsBar = sections.about_stats_bar && !sections.about_stats;

  return (
    <>
      <PageSEO
        pageKey="about"
        title={`About Us | ${companyName}`}
        description="Learn about TRANS-NET's vision, mission, values, and expertise in custom software development."
      />

      <AboutHero
        heroImage={heroImage || undefined}
        showStatsBar={showHeroStatsBar}
        stats={siteStats ?? []}
      />

      {sections.about_mission && (
        <AboutStatementSection
          sectionId="about_mission"
          eyebrow="Our mission"
          body={mission}
          icon={Target}
          imageUrl={missionImage || undefined}
          imagePosition={missionImagePosition}
          variant="mission"
        />
      )}

      {sections.about_vision && (
        <AboutStatementSection
          sectionId="about_vision"
          eyebrow="Our vision"
          body={vision}
          icon={Eye}
          imageUrl={visionImage || undefined}
          imagePosition={visionImagePosition}
          variant="vision"
        />
      )}

      {sections.about_story && (
        <AboutStorySection
          eyebrow={storyEyebrow}
          title={storyTitle}
          intro={intro}
          secondary={secondary}
          imageUrl={storyImage}
        />
      )}

      {sections.about_stats && <AboutStatsSection stats={siteStats ?? []} />}

      {sections.about_why && <AboutWhySection />}

      {sections.about_process && <AboutProcessSection />}

      {sections.about_industries && <AboutIndustriesSection />}

      {sections.about_products_promo && <AboutProductsPromo />}

      {sections.about_cta && <AboutCTASection />}
    </>
  );
}
