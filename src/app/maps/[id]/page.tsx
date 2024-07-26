import dynamic from "next/dynamic";
import ControlPanel from "@/components/map/ControlPanel";

const Canvas = dynamic(() => import("@/components/map/Canvas"), {
  ssr: false,
});

export default function MapView() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center">
      <Canvas />
      <ControlPanel />
    </div>
  );
}
