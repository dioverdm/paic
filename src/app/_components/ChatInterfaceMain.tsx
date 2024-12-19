"use client";

import React from "react";
import Intro from "./Intro";
import useMessages from "@/hooks/use-messages";
import ChatUI from "./ChatUI";

export default function ChatInterfaceMain() {
  const { messagesCount } = useMessages();
  return <>{messagesCount === 0 ? <Intro /> : <ChatUI />}</>;
}
