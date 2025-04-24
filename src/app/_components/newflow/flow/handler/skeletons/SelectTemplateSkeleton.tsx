"use client";

import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardHeader } from "~/components/ui/card";

const SelectTemplateSkeleton = () => {
  return (
    <div className="space-y-4 p-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="bg-xw-sidebar-two border-none shadow-none">
          <CardHeader className="tb:grid-cols-4 grid grid-cols-1 p-3">
            <Skeleton className="mb-4 h-7 w-2/3" />

            <div className="tb:col-span-3 tb:grid-cols-3 grid grid-cols-2 gap-4">
              {Array.from({ length: Math.floor(Math.random() * 3) + 2 }).map(
                (_, btnIndex) => (
                  <Skeleton key={btnIndex} className="h-9 w-full" />
                ),
              )}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default SelectTemplateSkeleton;
