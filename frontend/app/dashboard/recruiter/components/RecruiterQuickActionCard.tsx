"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RecruiterQuickActionCardProps } from "../types";

export function RecruiterQuickActionCard({
  title,
  description,
  icon: Icon,
  iconBgColor,
  href,
}: RecruiterQuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer hover:shadow-lg hover:border-primary transition-all group">
        <CardHeader>
          <div
            className={`h-12 w-12 rounded-full ${iconBgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
