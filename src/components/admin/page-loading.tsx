export function PageLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
