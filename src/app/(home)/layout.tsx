import DesktopNavBar from "@/components/layout/DesktopNavBar";

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <DesktopNavBar />
      {children}
    </div>
  );
}
