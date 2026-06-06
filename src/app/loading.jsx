export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-gray-200 dark:border-gray-700 border-t-primary-600 rounded-full animate-spin" />
      </div>
    </div>
  );
}
