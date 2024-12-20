"use client";

import React from "react";
import Intro from "./Intro";
import useMessages from "@/hooks/use-messages";
import ChatUI from "./ChatUI";
import { usePathname } from "next/navigation";

export default function ChatInterfaceMain() {
  const { messagesCount } = useMessages();
  const pathname = usePathname();
  const isNewChat = pathname === "/";

  if (isNewChat) {
    return <>{messagesCount === 0 ? <Intro /> : <ChatUI />}</>;
  }

  return <ChatUI />;
}
