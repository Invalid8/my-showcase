"use client";

import Image from "next/image";
import { useState } from "react";
import type { Img } from "@/content/case-studies";

export function Switcher({
  items,
}: {
  items: { label: string; image: Img }[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="switcher">
      <div className="switcher-stage">
        {items.map((item, index) => (
          <Image
            key={item.image.src}
            {...item.image}
            sizes="(max-width: 720px) 100vw, 640px"
            className={index === active ? "on" : undefined}
            aria-hidden={index !== active}
          />
        ))}
      </div>
      <div className="switcher-tabs" role="tablist">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={index === active}
            className={index === active ? "on" : undefined}
            onClick={() => setActive(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
