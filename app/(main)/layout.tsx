import type React from "react";
import ScrollRule from "@/components/shared/ScrollRule";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ScrollRule />
      {children}
    </div>
  );
}

export default layout;
