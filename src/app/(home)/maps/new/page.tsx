import NewMapForm from "@/components/map/NewMapForm";

export default async function NewMapPage() {
  return (
    <div className="flex flex-col max-w-[100dvw] lg:max-w-4xl px-4 lg:px-0 gap-6">
      <div>
        <h1 className="mb-2 text-lg font-bold">Create a new map</h1>
        <p>Give your new map a name or a title. What kind of thoughts do you want to keep track of?</p>
      </div>
      <NewMapForm />
    </div>
  );
}
