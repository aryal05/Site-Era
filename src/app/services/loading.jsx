export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="h-64 bg-gray-100 dark:bg-gray-900 animate-pulse" />
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse h-56" />
          ))}
        </div>
      </div>
    </div>
  );
}
