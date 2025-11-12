import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, LayoutDashboard, Clock } from "lucide-react";

interface Activity {
  id: string;
  query: string;
  action: "Dashboard" | "Report";
  timestamp: Date;
}

interface RecentActivitiesProps {
  activities: Activity[];
  onActivityClick: (activity: Activity) => void;
}

export default function RecentActivities({
  activities,
  onActivityClick,
}: RecentActivitiesProps) {
  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="border-b bg-gradient-to-r from-card to-muted/30 px-5 py-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm font-semibold text-primary">
            Recent Activities
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {activities.map((activity) => (
            <Button
              key={activity.id}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 px-3 hover:bg-accent/50 hover:border-primary/50 transition-all group"
              onClick={() => onActivityClick(activity)}
            >
              <div className="flex items-start gap-3 w-full">
                <div
                  className={`p-1.5 rounded-md shrink-0 ${
                    activity.action === "Dashboard"
                      ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                      : "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400"
                  }`}
                >
                  {activity.action === "Dashboard" ? (
                    <LayoutDashboard className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                    {activity.query}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {activity.action} • {activity.timestamp.toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
