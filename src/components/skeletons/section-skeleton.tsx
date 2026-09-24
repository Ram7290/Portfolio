import { Skeleton } from "@/components/ui/skeleton";

export function SectionSkeleton({ 
  title, 
  items = 3, 
  showGrid = false,
  className = "" 
}: { 
  title: string; 
  items?: number; 
  showGrid?: boolean;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Section Title */}
      <div className="text-center mb-12">
        <Skeleton className="h-8 w-48 mx-auto mb-4" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* Content Grid/List */}
      <div className={showGrid ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-6"}>
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="space-y-3">
            {showGrid ? (
              // Grid item (for projects, services)
              <>
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </>
            ) : (
              // List item (for experience, education, skills)
              <>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutSectionSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Skeleton className="h-8 w-32 mx-auto mb-4" />
      </div>
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>
    </section>
  );
}

export function SkillsSectionSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Skeleton className="h-8 w-24 mx-auto mb-4" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-20 rounded-full" />
        ))}
      </div>
    </section>
  );
}