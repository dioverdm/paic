"use client";

import { AppSidebar } from "@/components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "./Header";
import { useEffect, useState } from "react";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <div>
      <SidebarProvider className="hidden md:flex">
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 flex flex-col p-4 pt-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-red-500 text-white text-center md:hidden">
        Sorry for the inconvenience, but this app is not yet optimized for
        mobile devices.
      </div>
    </div>
  );
}
