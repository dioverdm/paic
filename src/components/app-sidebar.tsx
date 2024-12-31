"use client";

import * as React from "react";
import { CoffeeIcon, Send } from "lucide-react";
import { useEffect, useState } from "react";
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
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUserChat } from "@/store/userChat";

// Types for our chat data structure
interface ChatGroup {
  title: string;
  items: Array<{
    title: string;
    url: string;
    id: string;
    isActive?: boolean;
  }>;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navMain, setNavMain] = useState<ChatGroup[]>([]);
  const { id } = useParams();
  const chats = useUserChat((state) => state.chat); // Change this line

  useEffect(() => {
    // Group chats by date
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const prevMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const groupedChats: ChatGroup[] = [
      {
        title: "Today",
        items: [],
      },
      {
        title: "Yesterday",
        items: [],
      },
      {
        title: "Previous 30 Days",
        items: [],
      },
      {
        title: "Previous Month",
        items: [],
      },
    ];

    chats.forEach((chat) => {
      const chatDate = new Date(chat.createdAt);
      const chatItem = {
        title: chat.title,
        url: `/c/${chat.id}`,
        id: chat.id,
        isActive: chat.id === id,
      };

      if (chatDate.toDateString() === today.toDateString()) {
        groupedChats[0].items.push(chatItem);
      } else if (chatDate.toDateString() === yesterday.toDateString()) {
        groupedChats[1].items.push(chatItem);
      } else if (chatDate >= thirtyDaysAgo) {
        groupedChats[2].items.push(chatItem);
      } else if (chatDate >= prevMonthStart && chatDate <= prevMonthEnd) {
        groupedChats[3].items.push(chatItem);
      }
    });

    // Filter out empty groups and reverse items to show newest first
    const filteredGroups = groupedChats
      .filter((group) => group.items.length > 0)
      .map((group) => ({
        ...group,
        items: group.items.reverse(),
      }));

    setNavMain(filteredGroups);
  }, [chats, id]); // Change dependency array to use chats

  // Static data for other navigation items
  const navSecondary = [
    {
      title: "Buy Me a Coffee",
      url: "https://www.buymeacoffee.com/cwd.harshit",
      icon: CoffeeIcon,
    },
    {
      title: "Feedback",
      url: "mailto:cwd.harshit911@gmail.com",
      icon: Send,
    },
  ];

  const userDetailLocal = localStorage.getItem("user-details");

  const userDetails = userDetailLocal ? JSON.parse(userDetailLocal) : null;

  const user = userDetailLocal
    ? {
        name: userDetails.name,
        email: userDetails.email,
        avatar: "/avatars/shadcn.jpg",
      }
    : {
        name: "Harshit Sharma",
        email: "cwd.harshit911@gmail.com",
        avatar: "/avatars/shadcn.jpg",
      };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <Link href={"/"}>
          <LogoComp />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={navSecondary} className="" />
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
