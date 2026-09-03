import MobileMarketplaceHeader from "./MobileMarketplaceHeader";
import HideInactiveSocialLogin from "./HideInactiveSocialLogin";
import AccountTypographyPolish from "./AccountTypographyPolish";
import AnyDayWorkBranding from "./AnyDayWorkBranding";
import AnyDayWorkStartupGuard from "./AnyDayWorkStartupGuard";
import LoginViewportFit from "./LoginViewportFit";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnyDayWorkStartupGuard />
      {children}
      <MobileMarketplaceHeader />
      <HideInactiveSocialLogin />
      <AccountTypographyPolish />
      <AnyDayWorkBranding />
      <LoginViewportFit />
    </>
  );
}
