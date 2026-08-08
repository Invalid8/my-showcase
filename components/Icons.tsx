function Stroke(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
      {...props}
    />
  );
}

export function Layers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z" />
      <path d="m3 12.5 9 4.5 9-4.5" />
      <path d="m3 17 9 4.5L21 17" />
    </Stroke>
  );
}

export function Gauge(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <path d="M3.5 18a9 9 0 1 1 17 0" />
      <path d="m12 14 4.5-4.5" />
      <circle cx="12" cy="14" r="1.4" />
    </Stroke>
  );
}

export function Accessibility(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="4.5" r="1.8" />
      <path d="M5 9h14" />
      <path d="M12 9v6" />
      <path d="m9 21 3-6 3 6" />
    </Stroke>
  );
}

export function Devices(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <rect x="2.5" y="4.5" width="13" height="9.5" rx="1.5" />
      <path d="M6 18h6" />
      <rect x="17" y="9.5" width="4.5" height="10" rx="1.4" />
    </Stroke>
  );
}

export function Plug(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <path d="M9 2.5v5M15 2.5v5" />
      <path d="M6.5 7.5h11v3a5.5 5.5 0 0 1-11 0Z" />
      <path d="M12 16v5.5" />
    </Stroke>
  );
}

export function Compass(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5Z" />
    </Stroke>
  );
}

export function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <path d="M11 3.5 13 9l5.5 2-5.5 2-2 5.5-2-5.5L3.5 11 9 9Z" />
      <path d="M18.5 3v3M20 4.5h-3" />
      <path d="M6 17.5v2.5M7.25 18.75h-2.5" />
    </Stroke>
  );
}

export function GitHub(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
      {...props}
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

export function LinkedIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

export function Document(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
      {...props}
    >
      <path d="M14 2.75H7.5A1.75 1.75 0 0 0 5.75 4.5v15a1.75 1.75 0 0 0 1.75 1.75h9a1.75 1.75 0 0 0 1.75-1.75V7.25Z" />
      <path d="M14 2.75v4.5h4.25" />
      <path d="M9 13h6M9 16.5h4" />
    </svg>
  );
}

export function Info(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export function Close(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowUpRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 transition-transform duration-200 ease-[var(--ease-ui)] motion-safe:group-hover/social:translate-x-0.5"
      aria-hidden="true"
      {...props}
    >
      <path d="M7 7h10v10"></path>
      <path d="M7 17 17 7"></path>
    </svg>
  );
}
