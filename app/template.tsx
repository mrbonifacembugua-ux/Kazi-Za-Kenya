import JobCardProfilePhotos from "./JobCardProfilePhotos";
import MobileMarketplaceHeader from "./MobileMarketplaceHeader";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JobCardProfilePhotos />
      <MobileMarketplaceHeader />
    </>
  );
}
