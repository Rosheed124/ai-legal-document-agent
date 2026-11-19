// Import ClassValue type from clsx for handling conditional CSS class names
import { ClassValue, clsx } from "clsx";
// Import twMerge to intelligently merge conflicting Tailwind utility classes
import { twMerge } from "tailwind-merge";

// Helper function to combine multiple CSS classes and resolve any Tailwind conflicts
export function cn(...inputs: ClassValue[]): string {
  // Pass all class inputs through clsx to handle booleans and conditionals, then merge with twMerge
  return twMerge(clsx(inputs));
}

// Format a number as a percentage string
export function formatPercentage(value: number): string {
  // Round to nearest integer and append the percent sign
  return `${Math.round(value)}%`;
}

// Return human-friendly text and badge colors based on risk severity
export function getRiskBadgeProps(level: "critical" | "warning" | "low"): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
} {
  // Handle high danger critical risk
  if (level === "critical") {
    return {
      label: "Critical Liability",
      bgClass: "bg-red-500/15",
      textClass: "text-red-600 dark:text-red-400",
      borderClass: "border-red-500/30",
    };
  }
  // Handle moderate risk requiring caution
  if (level === "warning") {
    return {
      label: "Moderate Caution",
      bgClass: "bg-amber-500/15",
      textClass: "text-amber-600 dark:text-amber-400",
      borderClass: "border-amber-500/30",
    };
  }
  // Handle low risk or standard compliant clauses
  return {
    label: "Low Risk / Standard",
    bgClass: "bg-emerald-500/15",
    textClass: "text-emerald-600 dark:text-emerald-400",
    borderClass: "border-emerald-500/30",
  };
}
