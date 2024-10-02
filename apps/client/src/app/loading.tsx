/**
 * Renders a loading spinner
 */
export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 right-0 bottom-0 animate-spin">
          <div className="h-full w-full rounded-[50%] border-8 border-t-primary border-l-primary border-r-transparent border-b-transparent"></div>
        </div>
        <div className="absolute top-0 left-0 right-0 bottom-0 animate-ping">
          <div className="h-full w-full rounded-[50%] border-8 border-primary opacity-20"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
