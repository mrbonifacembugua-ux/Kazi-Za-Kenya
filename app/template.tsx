import MobileMarketplaceHeader from "./MobileMarketplaceHeader";
import MobileLoginAuthFix from "./MobileLoginAuthFix";
import HideInactiveSocialLogin from "./HideInactiveSocialLogin";
import AccountTypographyPolish from "./AccountTypographyPolish";
import AnyDayWorkBranding from "./AnyDayWorkBranding";
import AnyDayWorkStartupGuard from "./AnyDayWorkStartupGuard";
import LoginViewportFit from "./LoginViewportFit";
import GlobalMarketplaceLocation from "./GlobalMarketplaceLocation";
import MarketplaceCountrySignal from "./MarketplaceCountrySignal";
import MarketplaceCountryPicker from "./MarketplaceCountryPicker";
import MarketplaceDemoContent from "./MarketplaceDemoContent";
import MarketplaceDemoMapBridge from "./MarketplaceDemoMapBridge";
import MarketplaceDemoCountryGuard from "./MarketplaceDemoCountryGuard";
import MarketplaceDemoCurrency from "./MarketplaceDemoCurrency";
import MarketplaceDemoPhotoFix from "./MarketplaceDemoPhotoFix";
import MarketplaceSouthernDemoContent from "./MarketplaceSouthernDemoContent";
import MarketplaceNorthernDemoContent from "./MarketplaceNorthernDemoContent";
import MarketplaceRootCountryMapSync from "./MarketplaceRootCountryMapSync";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        #map.map,
        .leaflet-container {
          min-height: 360px;
          background: #e7efe9;
        }
      `}</style>

      {/* Render the AnyDayWork first-paint shield before the legacy marketplace
          markup so the browser never gets a chance to paint the old brand first. */}
      <AnyDayWorkStartupGuard />
      {children}
      <MarketplaceRootCountryMapSync />
      <MobileMarketplaceHeader />
      <MobileLoginAuthFix />
      <HideInactiveSocialLogin />
      <AccountTypographyPolish />
      <AnyDayWorkBranding />
      <LoginViewportFit />
      <GlobalMarketplaceLocation />
      <MarketplaceCountrySignal />
      <MarketplaceCountryPicker />
      <MarketplaceDemoContent />
      <MarketplaceDemoCurrency />
      <MarketplaceDemoPhotoFix />
      <MarketplaceDemoMapBridge />
      <MarketplaceDemoCountryGuard />
      <MarketplaceSouthernDemoContent />
      <MarketplaceNorthernDemoContent />
    </>
  );
}
