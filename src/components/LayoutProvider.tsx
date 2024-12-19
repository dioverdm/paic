import { AppSidebar } from "@/components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "./Header";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 flex flex-col p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
