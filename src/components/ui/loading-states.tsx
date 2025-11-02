import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Composed Loading State Components
 * Pre-built loading skeletons for common UI patterns
 */

// Loading Card - Generic card loading state
export interface LoadingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show header skeleton */
  showHeader?: boolean;
  /** Show footer skeleton */
  showFooter?: boolean;
  /** Number of content lines */
  contentLines?: number;
  /** Show avatar/icon */
  showAvatar?: boolean;
}

export function LoadingCard({
  className,
  showHeader = true,
  showFooter = false,
  contentLines = 3,
  showAvatar = false,
  ...props
}: LoadingCardProps) {
  return (
    <Card className={cn("", className)} {...props}>
      {showHeader && (
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            {showAvatar && <SkeletonCircle size="md" />}
          </div>
        </CardHeader>
      )}

      <CardContent className={showHeader ? "pt-0" : ""}>
        <SkeletonText lines={contentLines} />
      </CardContent>

      {showFooter && (
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Loading Stats - For stat card grids
export interface LoadingStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of stat cards to show */
  count?: number;
  /** Grid columns on desktop */
  columns?: 2 | 3 | 4;
}

export function LoadingStats({ className, count = 4, columns = 4, ...props }: LoadingStatsProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-card-gap", gridCols[columns], className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-card-padding">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
              <SkeletonCircle size="md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Loading List - For list items
export interface LoadingListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of list items to show */
  count?: number;
  /** Show avatars on list items */
  showAvatar?: boolean;
  /** Show action buttons */
  showActions?: boolean;
  /** List item height */
  itemHeight?: "sm" | "md" | "lg";
}

export function LoadingList({
  className,
  count = 5,
  showAvatar = true,
  showActions = false,
  itemHeight = "md",
  ...props
}: LoadingListProps) {
  const heights = {
    sm: "py-3",
    md: "py-4",
    lg: "py-6",
  };

  return (
    <div className={cn("space-y-3", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center justify-between gap-4 rounded-lg border bg-card p-4",
            heights[itemHeight]
          )}
        >
          <div className="flex items-center gap-4 flex-1">
            {showAvatar && <SkeletonCircle size="md" />}
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {showActions && (
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Loading Grid - For card/item grids
export interface LoadingGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of grid items to show */
  count?: number;
  /** Grid columns (responsive) */
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  /** Item aspect ratio */
  aspectRatio?: "square" | "video" | "portrait";
  /** Show content below image */
  showContent?: boolean;
}

export function LoadingGrid({
  className,
  count = 6,
  columns = { sm: 1, md: 2, lg: 3 },
  aspectRatio = "video",
  showContent = true,
  ...props
}: LoadingGridProps) {
  const aspectRatios = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  };

  const gridClasses = [
    columns.sm && `grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("grid gap-card-gap", gridClasses, className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className={cn("w-full", aspectRatios[aspectRatio])} shape="lg" />
          {showContent && (
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Loading Table Row - For table loading states
export interface LoadingTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Number of columns */
  columns?: number;
  /** Show checkbox column */
  showCheckbox?: boolean;
  /** Show actions column */
  showActions?: boolean;
}

export function LoadingTableRow({
  className,
  columns = 4,
  showCheckbox = false,
  showActions = false,
  ...props
}: LoadingTableRowProps) {
  const totalColumns = columns + (showCheckbox ? 1 : 0) + (showActions ? 1 : 0);

  return (
    <tr className={cn("border-b", className)} {...props}>
      {showCheckbox && (
        <td className="p-4">
          <Skeleton className="h-4 w-4" shape="default" />
        </td>
      )}

      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}

      {showActions && (
        <td className="p-4">
          <div className="flex gap-2 justify-end">
            <Skeleton className="h-8 w-8" shape="default" />
            <Skeleton className="h-8 w-8" shape="default" />
          </div>
        </td>
      )}
    </tr>
  );
}

// Loading Table - Complete table loading state
export interface LoadingTableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of rows */
  rows?: number;
  /** Number of columns */
  columns?: number;
  /** Show header */
  showHeader?: boolean;
  /** Show checkbox column */
  showCheckbox?: boolean;
  /** Show actions column */
  showActions?: boolean;
}

export function LoadingTable({
  className,
  rows = 5,
  columns = 4,
  showHeader = true,
  showCheckbox = false,
  showActions = false,
  ...props
}: LoadingTableProps) {
  const totalColumns = columns + (showCheckbox ? 1 : 0) + (showActions ? 1 : 0);

  return (
    <div className={cn("w-full overflow-auto", className)} {...props}>
      <table className="w-full">
        {showHeader && (
          <thead className="border-b">
            <tr>
              {showCheckbox && (
                <th className="p-4 text-left">
                  <Skeleton className="h-4 w-4" />
                </th>
              )}

              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="p-4 text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}

              {showActions && (
                <th className="p-4 text-right">
                  <Skeleton className="h-4 w-16" />
                </th>
              )}
            </tr>
          </thead>
        )}

        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <LoadingTableRow
              key={i}
              columns={columns}
              showCheckbox={showCheckbox}
              showActions={showActions}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export {
  LoadingCard as LoadingCardState,
  LoadingStats as LoadingStatsState,
  LoadingList as LoadingListState,
  LoadingGrid as LoadingGridState,
  LoadingTable as LoadingTableState,
  LoadingTableRow as LoadingTableRowState,
};
