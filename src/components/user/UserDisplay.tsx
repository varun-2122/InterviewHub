import { User2 } from "lucide-react";
import { Doc } from "../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserDocument = Doc<"users">;

interface UserDisplayProps {
  user: UserDocument;
}

// User display tile with profile photo and name
export function UserDisplay({ user }: UserDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6 ring-1 ring-border">
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback>
          <User2 className="h-4 w-4 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium tracking-tight truncate max-w-[120px] sm:max-w-none">
        {user.name}
      </span>
    </div>
  );
}

export default UserDisplay;
