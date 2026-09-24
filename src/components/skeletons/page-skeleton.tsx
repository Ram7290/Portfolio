import { Skeleton } from "@/components/ui/skeleton";

export function GenericPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page Header */}
      <div className="text-center mb-16">
        <Skeleton className="h-12 w-48 mx-auto mb-4" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page Header */}
      <div className="text-center mb-16">
        <Skeleton className="h-12 w-32 mx-auto mb-4" />
        <Skeleton className="h-6 w-64 mx-auto" />
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-12 mb-2" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
          
          <div>
            <Skeleton className="h-4 w-14 mb-2" />
            <Skeleton className="h-11 w-full" />
          </div>
          
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-32 w-full" />
          </div>

          <Skeleton className="h-11 w-32" />
        </div>
      </div>
    </div>
  );
}