import { cn } from "@/lib/utils";

interface PerformanceBadgeProps {
  level: "High" | "Medium" | "Low";
  size?: "sm" | "md" | "lg";
}

const styles = {
  High: "perf-high",
  Medium: "perf-medium",
  Low: "perf-low",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base font-semibold",
};

export default function PerformanceBadge({ level, size = "md" }: PerformanceBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full border font-medium", styles[level], sizeStyles[size])}>
      {level} Performance
    </span>
  );
}
