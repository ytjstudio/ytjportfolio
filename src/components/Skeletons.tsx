export function SkeletonCard() {
  return (<div className="glass p-4"><div className="skeleton aspect-[16/10] w-full" /><div className="skeleton mt-4 h-5 w-2/3" /><div className="skeleton mt-3 h-4 w-1/3" /><div className="skeleton mt-3 h-4 w-full" /><div className="skeleton mt-2 h-4 w-4/5" /><div className="mt-4 flex gap-2"><div className="skeleton h-7 w-20 rounded-full" /><div className="skeleton h-7 w-20 rounded-full" /></div></div>)
}
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}</div>)
}
export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}
