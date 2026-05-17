"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMeetingActions } from "@/hooks/useMeetingActions";

interface StartMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isJoinMeeting: boolean;
}

// Dialog letting users start an instant room or type/paste an invite link to join
export function StartMeetingModal({
  isOpen,
  onClose,
  title,
  isJoinMeeting,
}: StartMeetingModalProps) {
  const [meetingUrlOrId, setMeetingUrlOrId] = useState("");
  const { startInstantCall, navigateToCall } = useMeetingActions();

  const handleLaunchOrJoin = () => {
    if (isJoinMeeting) {
      const parsedId = meetingUrlOrId.trim().split("/").pop();
      if (parsedId) {
        navigateToCall(parsedId);
      }
    } else {
      startInstantCall();
    }

    setMeetingUrlOrId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-xl border border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          {isJoinMeeting && (
            <Input
              type="text"
              placeholder="Paste invitation link or meeting ID..."
              value={meetingUrlOrId}
              onChange={(e) => setMeetingUrlOrId(e.target.value)}
              className="w-full text-sm"
            />
          )}

          <div className="flex justify-end gap-2.5">
            <Button variant="outline" size="sm" onClick={onClose} className="font-medium text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleLaunchOrJoin}
              disabled={isJoinMeeting && !meetingUrlOrId.trim()}
              className="font-medium text-xs.5 bg-primary hover:bg-primary/95"
            >
              {isJoinMeeting ? "Connect" : "Initialize Call"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default StartMeetingModal;
