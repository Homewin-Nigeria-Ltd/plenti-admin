import * as React from "react";
import { cn } from "@/lib/utils";

const WARNING_COLOR = "#6B4E23";

type WarningIconProps = React.SVGProps<SVGSVGElement>;

/**
 * Warning icon: outline triangle with exclamation mark.
 * Use for warnings, alerts, or important notices.
 */
export function WarningIcon({ className, ...props }: WarningIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={WARNING_COLOR}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* Rounded triangle: equilateral, point up */}
      <path
        d="M12 3.5L21 19.5H3L12 3.5Z"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Exclamation: vertical line + dot */}
      <path d="M12 9v4" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.25" fill={WARNING_COLOR} />
    </svg>
  );
}
