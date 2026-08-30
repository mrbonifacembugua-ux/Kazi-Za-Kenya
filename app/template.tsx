import JobCardProfilePhotos from "./JobCardProfilePhotos";
import MobileMarketplaceHeader from "./MobileMarketplaceHeader";
import MobileLoginAuthFix from "./MobileLoginAuthFix";
import AccountTypographyPolish from "./AccountTypographyPolish";
import MarketplaceExternalListings from "./MarketplaceExternalListings";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JobCardProfilePhotos />
      <MobileMarketplaceHeader />
      <MobileLoginAuthFix />
      <AccountTypographyPolish />
      <MarketplaceExternalListings />
    </>
  );
}
