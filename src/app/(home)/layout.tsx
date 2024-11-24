import DesktopNavBar from "@/components/layout/DesktopNavBar";

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative">
      <DesktopNavBar />
      {children}
    </div>
  );
}
