import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page Header */}
      <div className="text-center mb-16">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      {/* Projects Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-18 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Back Button */}
      <Skeleton className="h-10 w-20 mb-8" />
      
      {/* Project Header */}
      <div className="mb-12">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-6 w-full mb-6" />
        <Skeleton className="h-6 w-3/4" />
        
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>

      {/* Project Image */}
      <Skeleton className="h-96 w-full rounded-lg mb-12" />

      {/* Project Description */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-full" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-8">
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-28" />
        </div>
      </div>
    </div>
  );
}