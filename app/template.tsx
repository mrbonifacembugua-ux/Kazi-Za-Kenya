import JobCardProfilePhotos from "./JobCardProfilePhotos";
import MobileMarketplaceHeader from "./MobileMarketplaceHeader";
import MobileLoginAuthFix from "./MobileLoginAuthFix";
import AccountTypographyPolish from "./AccountTypographyPolish";
import MarketplaceExternalListings from "./MarketplaceExternalListings";
import AnyDayWorkBranding from "./AnyDayWorkBranding";
import LoginViewportFit from "./LoginViewportFit";
import GlobalMarketplaceLocation from "./GlobalMarketplaceLocation";
import MarketplaceLiveWorkers from "./MarketplaceLiveWorkers";
import MarketplaceDemoContent from "./MarketplaceDemoContent";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JobCardProfilePhotos />
      <MobileMarketplaceHeader />
      <MobileLoginAuthFix />
      <AccountTypographyPolish />
      <MarketplaceExternalListings />
      <AnyDayWorkBranding />
      <LoginViewportFit />
      <GlobalMarketplaceLocation />
      <MarketplaceLiveWorkers />
      <MarketplaceDemoContent />
    </>
  );
}
