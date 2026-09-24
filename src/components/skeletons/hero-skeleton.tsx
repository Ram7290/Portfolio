import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        {/* Profile Image */}
        <div className="mb-6 flex justify-center">
          <Skeleton className="size-32 rounded-full" />
        </div>
        
        {/* Availability Badge */}
        <div className="mb-7 flex justify-center">
          <Skeleton className="h-7 w-48 rounded-full" />
        </div>

        {/* Name */}
        <div className="space-y-2 mb-5">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-12 w-64 mx-auto" />
        </div>

        {/* Role */}
        <div className="mb-5">
          <Skeleton className="h-6 w-56 mx-auto" />
        </div>

        {/* Tagline */}
        <div className="mb-9 space-y-2">
          <Skeleton className="h-5 w-full max-w-xl mx-auto" />
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Skeleton className="h-11 w-36" />
          <Skeleton className="h-11 w-44" />
        </div>
      </div>
    </div>
  );
}