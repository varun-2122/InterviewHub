import { Loader2Icon } from "lucide-react";

// Standard loading screen containing a clean spinning logo
export function Loader() {
  return (
    <div className="h-[calc(100vh-4rem-1px)] flex items-center justify-center bg-transparent">
      <Loader2Icon className="h-8 w-8 animate-spin text-primary/80" />
    </div>
  );
}

export default Loader;
