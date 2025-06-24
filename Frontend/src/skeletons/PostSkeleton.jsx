
function PostSkeleton() {
  return (
    <div className="bg-gray-200 animate-pulse shadow-md rounded-lg p-3.5 w-full h-[50vh] lg:max-w-3xl border border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between w-full space-x-3">
          <div className="flex items-center gap-x-3">
            <div className="w-12 h-12 rounded-full border-2 border-blue-500 bg-gray-400"></div>
            <div className="leading-tight">
              <div className="h-4 bg-gray-400 mt-1 rounded w-1/3"></div>
              <div className="h-4 bg-gray-400 mt-1 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-400 lg:text-sm md:text-sm text-[0.9rem] font-medium text-blue-600 flex items-center tracking-wide justify-center lg:px-5 md:px-3 px-2 py-2 mt-2 rounded-md">
        <div className="w-4 h-4 bg-gray-500 mr-1"></div>
        <div className="h-4 bg-gray-400 mt-1 rounded w-1/3"></div>
      </div>

      <div className="h-6 bg-gray-400 mt-2 rounded w-4/5"></div>

      <div className="flex justify-between gap-2 p-2 border-t border-gray-300 pt-3 items-center mt-4 text-gray-600 text-sm animate-pulse">
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-1">
            <div className="h-4 bg-gray-400 rounded w-1/4"></div>
            <div className="h-4 bg-gray-400 rounded w-16"></div>
          </div>

          <div className="flex items-center gap-x-1">
            <div className="h-4 bg-gray-400 rounded w-1/4"></div>
            <div className="h-4 bg-gray-400 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostSkeleton;
