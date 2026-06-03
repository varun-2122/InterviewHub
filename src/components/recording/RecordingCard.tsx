import { CallRecording } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { calculateTimeElapsed } from "@/lib/coreUtils";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Calendar, Clock, Link2, Play } from "lucide-react";
import { Button } from "../ui/button";

interface RecordingCardProps {
  recording: CallRecording;
}

// Card component rendering options to playback or copy reference link of a finished meeting recording
export function RecordingCard({ recording }: RecordingCardProps) {
  const copyDirectUrl = async () => {
    try {
      await navigator.clipboard.writeText(recording.url);
      toast.success("Copied recording link!");
    } catch (err) {
      console.error("Failed to write to clipboard:", err);
      toast.error("Failed to copy link.");
    }
  };

  const startTimeLabel = recording.start_time
    ? format(new Date(recording.start_time), "MMM d, yyyy • hh:mm a")
    : "Unknown Date";

  const lengthLabel =
    recording.start_time && recording.end_time
      ? calculateTimeElapsed(recording.start_time, recording.end_time)
      : "Unknown Length";

  const openPlaybackWindow = () => {
    window.open(recording.url, "_blank");
  };

  return (
    <Card className="group border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="space-y-1.5 p-4 bg-muted/10 border-b">
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary/70" />
            <span>{startTimeLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary/70" />
            <span>{lengthLabel}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div
          className="w-full aspect-video bg-muted/40 rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden group/thumb border border-dashed hover:border-primary/45 transition-colors"
          onClick={openPlaybackWindow}
        >
          <div className="size-11 rounded-full bg-card shadow-sm flex items-center justify-center group-hover/thumb:bg-primary transition-colors duration-300">
            <Play className="size-5 text-muted-foreground group-hover/thumb:text-primary-foreground transition-colors duration-300" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 p-4 pt-0">
        <Button className="flex-1 text-xs font-medium" size="sm" onClick={openPlaybackWindow}>
          <Play className="size-4 mr-1.5" />
          <span>Play Recording</span>
        </Button>
        <Button variant="secondary" size="sm" onClick={copyDirectUrl} title="Copy Recording Link">
          <Link2 className="size-4 text-foreground/80" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RecordingCard;
