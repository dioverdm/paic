"use client";

import {
  DeleteIcon,
  Edit2Icon,
  EllipsisVerticalIcon,
  type LucideIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { useUserChat } from "@/store/userChat";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url?: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      isActive?: boolean;
      id: string;
    }[];
  }[];
}) {
  const [hover, setHover] = useState(false);
  const [whatHover, setWhatHover] = useState<string | null>(null);
  const [rename, setRename] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [what, setWhat] = useState<string | null>(null);
  const { updateChatTitle, deleteChat } = useUserChat();
  const params = useParams();
  const { id }: { id?: string } = params;
  return (
    <>
      {items.map((item) => (
        <SidebarGroup key={item.title}>
          <SidebarGroupLabel className="sticky top-0 z-20 bg-sidebar">
            {item.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {item.items?.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    onMouseEnter={() => {
                      setHover(true);
                      setWhatHover(item.id);
                    }}
                    onMouseLeave={() => {
                      setHover(false);
                      setWhatHover(null);
                    }}
                  >
                    <div className="w-full flex justify-between items-center group">
                      <Link
                        className="block w-[90%]"
                        href={item.url}
                        title={item.title}
                      >
                        {what === item.id && rename ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();

                              updateChatTitle(what, inputValue);
                              setRename(false);
                              setWhat(null);
                            }}
                          >
                            <Input
                              className="truncate"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                            />
                          </form>
                        ) : (
                          <p className="truncate">{item.title}</p>
                        )}
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          className={cn({
                            "opacity-0": !hover || whatHover !== item.id,
                          })}
                        >
                          <EllipsisVerticalIcon className="size-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              setRename(true);
                              setWhat(item.id);
                            }}
                          >
                            <Edit2Icon className="size-5" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => {
                              if (item.id === id) {
                                toast.warning(
                                  "You can't delete the active chat"
                                );
                                return;
                              }

                              deleteChat(item.id);
                            }}
                          >
                            <DeleteIcon className="size-5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
