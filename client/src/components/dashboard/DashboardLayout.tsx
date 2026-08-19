interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-dvh bg-[#f4f5f2] text-[#152033]">
      <main className="mx-auto min-h-dvh w-full max-w-[1560px] px-5 py-7 pr-24 sm:px-8 sm:py-10 sm:pr-28 lg:px-12 lg:pr-32">
        {children}
      </main>
    </div>
  );
}
