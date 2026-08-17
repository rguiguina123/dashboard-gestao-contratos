interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-dvh bg-[#f6f9fa] text-[#102f40]">
      <main className="mx-auto min-h-dvh w-full max-w-[1680px] px-5 py-5 pb-20 sm:px-8 sm:py-6 sm:pb-6 sm:pr-24 lg:px-10 lg:pr-28">
        {children}
      </main>
    </div>
  );
}
