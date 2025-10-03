import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/images/narbox-logo.png"
            alt="NarBox Logo"
            width={120}
            height={120}
            priority
          />
        </div>
        {children}
      </div>
    </div>
  );
}
