
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function KPICard({ title, value, icon: Icon, trend }: KPICardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
            <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs md:text-sm font-medium ${
              trend.isPositive 
                ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
            }`}>
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
              ) : (
                <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />
              )}
              {trend.value}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm md:text-base text-muted-foreground font-medium mb-1">{title}</p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
