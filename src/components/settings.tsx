"use client";

import * as React from "react";
import {
  BrainIcon,
  LayoutDashboard,
  Settings,
  SparklesIcon,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { ScrollArea } from "./ui/scroll-area";
import CommonSettings from "./CommonSettings";
import { ModelSettings } from "./ModelSettings";
import MemorySettings from "./MemorySettings";
import PluginSettings from "./PluginSettings";

const data = {
  nav: [
    { name: "Common", icon: Settings },
    { name: "Providers", icon: SparklesIcon },
    { name: "Plugins", icon: LayoutDashboard },
    { name: "Memory", icon: BrainIcon },
  ],
};

export function SettingsDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [selected, setSelected] = React.useState("Common");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex w-40">
            <SidebarContent className="">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === selected}
                          onClick={() => setSelected(item.name)}
                        >
                          <div className="flex items-center gap-2 cursor-pointer">
                            <item.icon />
                            <span>{item.name}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      Settings
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{selected}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <ScrollArea className="flex-1 px-4">
              {(() => {
                switch (selected) {
                  case "Common":
                    return <CommonSettings />;
                  case "Providers":
                    return <ModelSettings />;
                  case "Memory":
                    return <MemorySettings />;
                  case "Plugins":
                    return <PluginSettings />;
                  default:
                    return null;
                }
              })()}
            </ScrollArea>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
