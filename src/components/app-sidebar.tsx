"use client";

import * as React from "react";
import { Frame, LifeBuoy, Map, PieChart, Send } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { LogoComp } from "@/components/logo-comp";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavSecondary } from "./nav-secondary";

// This is sample data.
const data = {
  user: {
    name: "Harshit Sharma",
    email: "cwd.harshit911@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: "/logo.svg",
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Today",
      items: [
        {
          title: "How do I design a new page?",
          url: "#",
        },
        {
          title: "How to use the AI",
          url: "#",
        },
        {
          title: "How do I use the AI to generate content?",
          url: "#",
        },
      ],
    },
    {
      title: "Yesterday",
      items: [
        {
          title: "How do I integrate with external APIs?",
          url: "#",
        },
        {
          title: "What are best practices for error handling?",
          url: "#",
        },
        {
          title: "Can you explain dependency injection?",
          url: "#",
        },
      ],
    },
    {
      title: "Previous 30 Days",
      items: [
        {
          title: "How to implement authentication?",
          url: "#",
        },
        {
          title: "What's the difference between props and state?",
          url: "#",
        },
        {
          title: "How do I optimize React performance?",
          url: "#",
        },
        {
          title: "Best practices for state management?",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <LogoComp />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
