import AnyDayWorkBranding from "./AnyDayWorkBranding";
import AnyDayWorkStartupGuard from "./AnyDayWorkStartupGuard";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnyDayWorkStartupGuard />
      {children}
      <AnyDayWorkBranding />
    </>
  );
}
