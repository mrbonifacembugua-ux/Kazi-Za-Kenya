import type { ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
};

export default function MarketplaceEntryLink({ href, className, children }: Props) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
