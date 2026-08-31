import JobCardProfilePhotos from "./JobCardProfilePhotos";
import MobileMarketplaceHeader from "./MobileMarketplaceHeader";
import MobileLoginAuthFix from "./MobileLoginAuthFix";
import HideInactiveSocialLogin from "./HideInactiveSocialLogin";
import AccountTypographyPolish from "./AccountTypographyPolish";
import AnyDayWorkBranding from "./AnyDayWorkBranding";
import AnyDayWorkStartupGuard from "./AnyDayWorkStartupGuard";
import LoginViewportFit from "./LoginViewportFit";
import GlobalMarketplaceLocation from "./GlobalMarketplaceLocation";
import MarketplaceCountrySignal from "./MarketplaceCountrySignal";
import MarketplaceLiveWorkers from "./MarketplaceLiveWorkers";
import MarketplaceDemoContent from "./MarketplaceDemoContent";
import MarketplaceDemoMapBridge from "./MarketplaceDemoMapBridge";
import MarketplaceDemoCountryGuard from "./MarketplaceDemoCountryGuard";
import MarketplaceDemoCurrency from "./MarketplaceDemoCurrency";
import MarketplaceDemoPhotoFix from "./MarketplaceDemoPhotoFix";
import MarketplaceSouthernDemoContent from "./MarketplaceSouthernDemoContent";

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
      <MarketplaceCountrySignal />
      <MarketplaceLiveWorkers />
      <MarketplaceDemoContent />
      <MarketplaceDemoCurrency />
      <MarketplaceDemoPhotoFix />
      <MarketplaceDemoMapBridge />
      <MarketplaceDemoCountryGuard />
      <MarketplaceSouthernDemoContent />
    </>
  );
}
