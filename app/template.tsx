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
import MarketplaceCountryPicker from "./MarketplaceCountryPicker";
import MarketplaceLiveWorkers from "./MarketplaceLiveWorkers";
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
      {/* Keep Leaflet available before the marketplace page hydrates. The page
          still has its own loader, so this is a reliable CDN fallback rather
          than a change to marketplace behaviour. */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin="anonymous"
      />
      <script
        src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"
        crossOrigin="anonymous"
      />
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
      <JobCardProfilePhotos />
      <MobileMarketplaceHeader />
      <MobileLoginAuthFix />
      <HideInactiveSocialLogin />
      <AccountTypographyPolish />
      <AnyDayWorkBranding />
      <LoginViewportFit />
      <GlobalMarketplaceLocation />
      <MarketplaceCountrySignal />
      <MarketplaceCountryPicker />
      <MarketplaceLiveWorkers />
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
