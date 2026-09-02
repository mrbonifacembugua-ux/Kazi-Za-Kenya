import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
};

export default function MarketplaceEntryLink({ href, className, children }: Props) {
  return (
    <Link href={href} className={className} prefetch>
      {children}
    </Link>
  );
}
