import type React from "react";
import ProximitySidebar from "@/components/shared/ProximitySidebar";
import SiteFooter from "@/components/shared/SiteFooter";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ProximitySidebar
        side="left"
        sections={[
          { id: "intro", label: "Introduction", kind: "title" },
          { id: "work", label: "Selected work", kind: "section" },
          { id: "approach", label: "Approach", kind: "subtitle" },
          { id: "capabilities", label: "Capabilities", kind: "subtitle" },
          { id: "feed", label: "My feed", kind: "subtitle" },
          { id: "care", label: "What I care about", kind: "subtitle" },
          { id: "music", label: "Music", kind: "section" },
        ]}
      />
      {children}
      <SiteFooter />
    </div>
  );
}

export default layout;
