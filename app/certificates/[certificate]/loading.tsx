export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto lg:px-0 px-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex flex-col gap-y-3">
          <span className="w-24 h-5 dark:bg-primary-bg bg-zinc-200 rounded-sm animate-pulse"></span>
          <span className="w-64 h-11 dark:bg-primary-bg bg-zinc-200 rounded-sm animate-pulse"></span>
        </div>
        <span className="w-44 h-11 dark:bg-primary-bg bg-zinc-200 rounded-sm animate-pulse"></span>
      </div>
      <div className="flex gap-4 mb-8 flex-wrap">
        <span className="w-32 h-6 dark:bg-primary-bg bg-zinc-200 rounded-sm animate-pulse"></span>
        <span className="w-32 h-6 dark:bg-primary-bg bg-zinc-200 rounded-sm animate-pulse"></span>
      </div>
      <div className="w-full h-96 mb-8 dark:bg-primary-bg bg-zinc-200 rounded-sm animate-pulse"></div>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mb-8">
        <span className="w-full h-24 dark:bg-primary-bg bg-zinc-200 rounded-sm animate-pulse"></span>
        <span className="w-full h-24 dark:bg-primary-bg bg-zinc-200 rounded-sm animate-pulse"></span>
      </div>
      <div className="flex flex-col gap-y-2">
        <span className="w-full h-5 dark:bg-primary-bg bg-zinc-200 rounded-sm animate-pulse"></span>
        <span className="w-full h-5 dark:bg-primary-bg bg-zinc-200 rounded-sm animate-pulse"></span>
      </div>
    </div>
  );
}
