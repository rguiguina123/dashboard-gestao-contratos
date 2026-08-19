import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendValue,
  delay = 0,
}: MetricCardProps) {
  return (
    <Card
      className="card-elevated metric-card border-0 hover-lift transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
      style={{
        animation: `slideInUp 0.5s ease-out ${delay}s backwards`,
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className="rounded-lg bg-[#c2e6f0] p-2 text-[#003f5f]">
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground font-poppins">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div
              className={`text-xs font-medium flex items-center gap-1 ${
                trend === "up"
                  ? "text-emerald-600"
                  : trend === "down"
                    ? "text-red-600"
                    : "text-slate-600"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : trend === "down" ? (
                <TrendingDown className="w-3 h-3" />
              ) : null}
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
