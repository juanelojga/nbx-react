export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 rounded-2xl bg-[#1976D2] flex items-center justify-center text-white text-3xl font-bold">
            N
          </div>
          <h1 className="text-3xl font-bold text-gray-900">NarBox</h1>
          <p className="text-gray-600">Servicio de Courier</p>
        </div>
        {children}
      </div>
    </div>
  );
}
