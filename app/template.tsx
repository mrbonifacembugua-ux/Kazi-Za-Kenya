import JobCardProfilePhotos from "./JobCardProfilePhotos";
import MobileMarketplaceHeader from "./MobileMarketplaceHeader";
import MobileLoginAuthFix from "./MobileLoginAuthFix";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JobCardProfilePhotos />
      <MobileMarketplaceHeader />
      <MobileLoginAuthFix />
    </>
  );
}
