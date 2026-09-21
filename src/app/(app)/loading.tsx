import { Skeleton } from "@/components/ui/data-display";

export default function Loading() {
  return (
    <div className="animate-[fade-up_0.3s_var(--ease-out-quint)]">
      <div className="mb-6 space-y-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-7 w-72" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-line bg-surface p-4 shadow-sm">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-7 w-32" />
            <Skeleton className="mt-3 h-3 w-40" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="rounded-lg border border-line bg-surface p-5 shadow-sm xl:col-span-8">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-4 h-[248px] w-full" />
        </div>
        <div className="rounded-lg border border-line bg-surface p-5 shadow-sm xl:col-span-4">
          <Skeleton className="h-4 w-36" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
