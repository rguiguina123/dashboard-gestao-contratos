import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "primary" | "success" | "warning" | "danger";
  delay?: number;
}

export function KPICard({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = "primary",
  delay = 0,
}: KPICardProps) {
  const colorClasses = {
    primary: "from-purple-100/50 to-purple-50/50 border-purple-200",
    success: "from-green-100/50 to-green-50/50 border-green-200",
    warning: "from-amber-100/50 to-amber-50/50 border-amber-200",
    danger: "from-red-100/50 to-red-50/50 border-red-200",
  };

  const trendColors = {
    up: "text-emerald-600",
    down: "text-red-600",
    neutral: "text-slate-600",
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} border card-elevated hover-lift transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer`}
      style={{
        animation: `slideInUp 0.5s ease-out ${delay}s backwards`,
      }}
    >
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </p>
              <p className="text-2xl font-bold text-foreground font-poppins">
                {value}
              </p>
            </div>
            {icon && (
              <div className="p-3 rounded-lg bg-purple-100">{icon}</div>
            )}
          </div>

          {trend && trendValue && (
            <div
              className={`text-xs font-semibold flex items-center gap-1 ${trendColors[trend]}`}
            >
              {trend === "up" ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : trend === "down" ? (
                <ArrowDownRight className="w-3 h-3" />
              ) : null}
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
