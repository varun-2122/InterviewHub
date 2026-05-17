import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { LayoutGrid, Loader, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import EndCallButton from "./EndCallButton";
import CodeWorkspace from "../editor/CodeWorkspace";

// Live meeting workspace room split between video stream controls and code workspace
export function MeetingConsole() {
  const routerInstance = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "speaker">("speaker");
  const [displayAttendees, setDisplayAttendees] = useState(false);
  
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem-1px)]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={25}
          maxSize={100}
          className="relative"
        >
          <div className="absolute inset-0">
            {viewMode === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

            {displayAttendees && (
              <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CallParticipantsList
                  onClose={() => setDisplayAttendees(false)}
                />
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                <CallControls onLeave={() => routerInstance.push("/")} />

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="size-10">
                        <LayoutGrid className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setViewMode("grid")} className="cursor-pointer">
                        Grid View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setViewMode("speaker")} className="cursor-pointer">
                        Speaker View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10"
                    onClick={() => setDisplayAttendees(!displayAttendees)}
                  >
                    <Users className="size-4" />
                  </Button>

                  <EndCallButton />
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={65} minSize={25}>
          <CodeWorkspace />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default MeetingConsole;
