import JobCardProfilePhotos from "./JobCardProfilePhotos";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JobCardProfilePhotos />
    </>
  );
}
