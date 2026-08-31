import JobCardProfilePhotos from "./JobCardProfilePhotos";
import MobileMarketplaceHeader from "./MobileMarketplaceHeader";
import MobileLoginAuthFix from "./MobileLoginAuthFix";
import HideInactiveSocialLogin from "./HideInactiveSocialLogin";
import AccountTypographyPolish from "./AccountTypographyPolish";
import AnyDayWorkBranding from "./AnyDayWorkBranding";
import AnyDayWorkStartupGuard from "./AnyDayWorkStartupGuard";
import LoginViewportFit from "./LoginViewportFit";
import GlobalMarketplaceLocation from "./GlobalMarketplaceLocation";
import MarketplaceLiveWorkers from "./MarketplaceLiveWorkers";
import MarketplaceDemoContent from "./MarketplaceDemoContent";
import MarketplaceDemoMapBridge from "./MarketplaceDemoMapBridge";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AnyDayWorkStartupGuard />
      <JobCardProfilePhotos />
      <MobileMarketplaceHeader />
      <MobileLoginAuthFix />
      <HideInactiveSocialLogin />
      <AccountTypographyPolish />
      <AnyDayWorkBranding />
      <LoginViewportFit />
      <GlobalMarketplaceLocation />
      <MarketplaceLiveWorkers />
      <MarketplaceDemoContent />
      <MarketplaceDemoMapBridge />
    </>
  );
}
