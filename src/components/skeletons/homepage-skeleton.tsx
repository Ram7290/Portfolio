import { HeroSkeleton } from "./hero-skeleton";
import { AboutSectionSkeleton, SkillsSectionSkeleton, SectionSkeleton } from "./section-skeleton";

export function HomepageSkeleton() {
  return (
    <>
      {/* Hero Section */}
      <HeroSkeleton />
      
      {/* Main Content */}
      <div className="mx-auto max-w-6xl space-y-28 px-4 pb-28 sm:px-6 lg:px-8">
        {/* About Section */}
        <AboutSectionSkeleton />

        {/* Skills Section */}
        <SkillsSectionSkeleton />

        {/* Experience Section */}
        <SectionSkeleton 
          title="Experience" 
          items={4}
        />

        {/* Featured Projects Section */}
        <SectionSkeleton 
          title="Featured Projects" 
          items={3} 
          showGrid={true}
        />

        {/* All Projects Section */}
        <SectionSkeleton 
          title="All Projects" 
          items={6} 
          showGrid={true}
        />

        {/* Services Section */}
        <SectionSkeleton 
          title="Services" 
          items={3} 
          showGrid={true}
        />

        {/* Education Section */}
        <SectionSkeleton 
          title="Education" 
          items={2}
        />

        {/* Resume CTA */}
        <div className="text-center">
          <div className="space-y-4">
            <div className="h-8 w-64 mx-auto bg-muted animate-pulse rounded-md" />
            <div className="h-5 w-96 mx-auto bg-muted animate-pulse rounded-md" />
            <div className="h-11 w-40 mx-auto bg-muted animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    </>
  );
}