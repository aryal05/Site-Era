export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header skeleton */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 w-32 h-8 animate-pulse" />
            <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl w-3/4 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-lg w-2/3 mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="py-12 lg:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 h-full">
                <div className="h-52 bg-gray-100 dark:bg-gray-700 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-20 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse" />
                  </div>
                  <div className="h-5 w-3/4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="flex gap-1.5">
                    <div className="h-5 w-14 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-5 w-14 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-5 w-14 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
