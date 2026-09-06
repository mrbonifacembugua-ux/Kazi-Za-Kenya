import AdminShortcut from "./AdminShortcut";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminShortcut />
      {children}
    </>
  );
}
