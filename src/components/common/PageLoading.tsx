export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-[#1976D2] flex items-center justify-center text-white text-3xl font-bold">
            N
          </div>
        </div>
        {/* Rule 6.1: Animate wrapper div instead of spinner element */}
        <div className="animate-spin mx-auto mb-4">
          <div className="h-8 w-8 border-4 border-[#1976D2] border-t-transparent rounded-full" />
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
