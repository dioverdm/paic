import React from "react";
import Intro from "./_components/Intro";
import AiInput from "./_components/AiInput";

export default function page() {
  return (
    <div className="flex-1 flex justify-center">
      <div className="max-w-2xl flex-1 flex flex-col gap-6 justify-between">
        <Intro />
        <div className="sticky bottom-4">
          <AiInput />
        </div>
      </div>
    </div>
  );
}
