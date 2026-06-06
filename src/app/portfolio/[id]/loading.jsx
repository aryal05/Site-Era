export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header skeleton */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="h-5 w-36 bg-gray-100 dark:bg-gray-800 rounded mb-8 animate-pulse" />
          <div className="max-w-4xl">
            <div className="h-7 w-24 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 animate-pulse" />
            <div className="h-12 w-3/4 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4 animate-pulse" />
            <div className="h-6 w-2/3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-8 animate-pulse" />
            <div className="flex gap-6">
              <div className="h-12 w-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-12 w-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-12 w-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Image skeleton */}
      <section className="py-8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="h-[400px] lg:h-[500px] bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
        </div>
      </section>
    </div>
  );
}
