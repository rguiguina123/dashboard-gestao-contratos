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
    primary: "from-[#c2e6f0]/70 to-[#eaf3f7]/70 border-[#8fd2e6]",
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
      className={`bg-gradient-to-br ${colorClasses[color]} border card-elevated transition-shadow duration-200 hover:shadow-xl cursor-default`}
      style={{
        animation: `slideInUp 0.5s ease-out ${delay}s backwards`,
      }}
    >
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="type-label text-muted-foreground mb-1.5">
                {title}
              </p>
              <p className="text-[1.65rem] leading-none font-bold text-foreground font-poppins tabular-nums">
                {value}
              </p>
            </div>
            {icon && (
              <div className="rounded-md border border-white/70 bg-[#c2e6f0]/75 p-2.5">{icon}</div>
            )}
          </div>

          {trend && trendValue && (
            <div
              className={`text-[0.6875rem] font-semibold tracking-[0.01em] flex items-center gap-1 ${trendColors[trend]}`}
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
