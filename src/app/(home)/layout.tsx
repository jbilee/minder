import DesktopNavBar from "@/components/layout/DesktopNavBar";
import MobileNavBar from "@/components/layout/MobileNavBar";

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative">
      <DesktopNavBar />
      <div className="lg:grid lg:place-content-center py-10">{children}</div>
      <MobileNavBar />
    </main>
  );
}
