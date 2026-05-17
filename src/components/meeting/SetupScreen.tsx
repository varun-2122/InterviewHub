import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Video, VideoOff, Mic, MicOff, Settings } from "lucide-react";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

interface SetupScreenProps {
  onSetupComplete: () => void;
}

// Media verification setup page before entering a call
export function SetupScreen({ onSetupComplete }: SetupScreenProps) {
  const [videoDisabled, setVideoDisabled] = useState(true);
  const [audioDisabled, setAudioDisabled] = useState(false);

  const activeCall = useCall();

  useEffect(() => {
    if (!activeCall) return;

    if (videoDisabled) {
      activeCall.camera.disable();
    } else {
      activeCall.camera.enable();
    }
  }, [videoDisabled, activeCall]);

  useEffect(() => {
    if (!activeCall) return;

    if (audioDisabled) {
      activeCall.microphone.disable();
    } else {
      activeCall.microphone.enable();
    }
  }, [audioDisabled, activeCall]);

  if (!activeCall) {
    return null;
  }

  const joinActiveCall = async () => {
    try {
      await activeCall.join();
      onSetupComplete();
    } catch (err) {
      console.error("Failed to join call room session:", err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem-1px)] flex items-center justify-center p-4 sm:p-6 bg-background/95">
      <div className="w-full max-w-[1000px] mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border p-6 flex flex-col justify-between rounded-2xl shadow-sm">
            <div className="space-y-1.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Media Feeds</h1>
              <p className="text-sm text-muted-foreground">
                Verify camera positioning and lighting.
              </p>
            </div>

            <div className="mt-4 flex-1 min-h-[300px] sm:min-h-[360px] rounded-xl overflow-hidden bg-muted/30 border border-border/80 relative flex items-center justify-center shadow-inner">
              <div className="absolute inset-0">
                <VideoPreview className="h-full w-full object-cover" />
              </div>
            </div>
          </Card>

          <Card className="border border-border p-6 rounded-2xl shadow-sm">
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Device Settings</h2>
                <p className="text-xs.5 font-mono text-muted-foreground select-all break-all bg-muted/40 p-2 rounded-lg border">
                  Session Room: {activeCall.id}
                </p>
              </div>

              <div className="space-y-6 my-8">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {videoDisabled ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Camera Feed</p>
                      <p className="text-xs text-muted-foreground">
                        {videoDisabled ? "Disabled" : "Active"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={!videoDisabled}
                    onCheckedChange={(checked) => setVideoDisabled(!checked)}
                  />
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {audioDisabled ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Microphone Input</p>
                      <p className="text-xs text-muted-foreground">
                        {audioDisabled ? "Muted" : "Unmuted"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={!audioDisabled}
                    onCheckedChange={(checked) => setAudioDisabled(!checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">System Devices</p>
                      <p className="text-xs text-muted-foreground">
                        Select audio/video hardware inputs
                      </p>
                    </div>
                  </div>
                  <DeviceSettings />
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full font-medium" size="lg" onClick={joinActiveCall}>
                  Connect to Meeting Room
                </Button>
                <p className="text-2xs text-center text-muted-foreground/80">
                  Ready to go? Ensure your hardware settings are correct.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SetupScreen;
