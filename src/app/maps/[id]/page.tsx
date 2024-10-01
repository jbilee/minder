import dynamic from "next/dynamic";
import ControlPanel from "@/components/map/ControlPanel";

const Canvas = dynamic(() => import("@/components/map/Canvas"), {
  ssr: false,
});

export default function MapView() {
  return (
    <div className="flex flex-col min-h-dvh justify-center items-center">
      <Canvas />
      <ControlPanel />
    </div>
  );
}
