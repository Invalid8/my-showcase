"use client";

import { useState } from "react";

export function LivePreview({ url, title }: { url: string; title: string }) {
  const [key, setKey] = useState(0);
  const host = new URL(url).host;

  return (
    <div className="frame live">
      <header>
        <span>
          <span className="dot" aria-hidden="true" />
          live · {host}
        </span>
        <nav>
          <button
            type="button"
            className="copy-button"
            onClick={() => setKey((k) => k + 1)}
          >
            reload
          </button>
          <a className="copy-button" href={url} target="_blank" rel="noopener">
            open ↗
          </a>
        </nav>
      </header>
      <iframe key={key} src={url} title={title} loading="lazy" />
    </div>
  );
}
