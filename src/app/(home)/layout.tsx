import DesktopNavBar from "@/components/layout/DesktopNavBar";

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative">
      <DesktopNavBar />
      <div className="grid place-content-center py-10">{children}</div>
    </main>
  );
}
