"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

// Helper function to format path segment into readable text
function formatPathSegment(segment: string): string {
  // Remove any special characters and split by hyphens/underscores
  const words = segment
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(/[\s-_]+/)
    .filter(Boolean);

  // Capitalize each word and join with spaces
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Helper function to build the path up to the current segment
function buildPath(segments: string[], index: number): string {
  return "/" + segments.slice(0, index + 1).join("/");
}

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Skip if we're at the root
  if (pathname === "/") {
    return null;
  }

  // Split the pathname into segments and remove empty strings
  const segments = pathname.split("/").filter(Boolean);

  // Generate breadcrumbs from path segments
  const breadcrumbs = segments.map((segment, index) => ({
    label: formatPathSegment(segment),
    path: buildPath(segments, index),
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <React.Fragment key={crumb.path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.path}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
