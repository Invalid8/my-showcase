import type { ReactNode } from "react";

export type NumberedItem = {
  key: string;
  title: ReactNode;
  body?: ReactNode;
  meta?: string;
};

export function NumberedList({ items }: { items: NumberedItem[] }) {
  return (
    <ol className="numbered">
      {items.map((item, index) => (
        <li key={item.key}>
          <span className="num" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3>{item.title}</h3>
          {item.body && <p>{item.body}</p>}
          {item.meta && <div className="mono-meta">{item.meta}</div>}
        </li>
      ))}
    </ol>
  );
}
