import AnyDayWorkBranding from "./AnyDayWorkBranding";
import AnyDayWorkStartupGuard from "./AnyDayWorkStartupGuard";
import MobileMarketplaceHeader from "./MobileMarketplaceHeader";
import AccountTypographyPolish from "./AccountTypographyPolish";
import LoginViewportFit from "./LoginViewportFit";
import HideInactiveSocialLogin from "./HideInactiveSocialLogin";
import MarketplaceCountrySignal from "./MarketplaceCountrySignal";
import MarketplaceCountryPicker from "./MarketplaceCountryPicker";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnyDayWorkStartupGuard />
      {children}
      <MobileMarketplaceHeader />
      <AccountTypographyPolish />
      <LoginViewportFit />
      <HideInactiveSocialLogin />
      <AnyDayWorkBranding />
      <MarketplaceCountrySignal />
      <MarketplaceCountryPicker />
    </>
  );
}
