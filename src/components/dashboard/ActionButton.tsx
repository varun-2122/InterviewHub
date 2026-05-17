import { MenuItemInfo } from "@/constants/sessionConfig";
import { Card } from "../ui/card";

interface ActionButtonProps {
  item: MenuItemInfo;
  onPress: () => void;
}

const themeStyleMap: Record<string, { badgeBg: string; textBadge: string }> = {
  "primary": { badgeBg: "bg-primary/10", textBadge: "text-primary" },
  "purple-500": { badgeBg: "bg-purple-500/10", textBadge: "text-purple-500" },
  "blue-500": { badgeBg: "bg-blue-500/10", textBadge: "text-blue-500" },
  "orange-500": { badgeBg: "bg-orange-500/10", textBadge: "text-orange-500" },
};

// Layout button representing a quick action tile on the dashboard
export function ActionButton({ item, onPress }: ActionButtonProps) {
  const styles = themeStyleMap[item.color] || themeStyleMap["primary"];

  return (
    <Card
      className="group relative overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
      onClick={onPress}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-90 group-hover:opacity-60 transition-opacity duration-300`}
      />

      <div className="relative p-6 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${styles.badgeBg} group-hover:scale-105 transition-transform duration-300`}
          >
            <item.icon className={`h-5.5 w-5.5 ${styles.textBadge}`} />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-xs.5 text-muted-foreground leading-normal">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ActionButton;
