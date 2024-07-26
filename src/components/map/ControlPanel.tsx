export default function ControlPanel() {
  return (
    <div className="fixed right-6 grid place-content-center">
      <div className="flex flex-col p-4 rounded-2xl gap-4 text-nowrap bg-slate-400">
        <div>Rearrange bubbles</div>
        <div>Return to center</div>
        <div>Hide UI</div>
        <div>Export as image</div>
      </div>
    </div>
  );
}
