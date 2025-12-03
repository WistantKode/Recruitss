"use client";

import {useRouter} from "next/navigation";
import {Card, CardContent} from "@/components/ui/card";
import {QuickActionCardProps} from "@/app/dashboard/admin/types";

export function QuickActionCard({
                                    title,
                                    description,
                                    icon: Icon,
                                    iconBgColor,
                                    iconTextColor,
                                    href,
                                }: QuickActionCardProps) {
    const router = useRouter();
    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-shadow hover:scale-105 duration-200"
            onClick={() => router.push(href)}
        >
            <CardContent className="p-6">
                <div className={`p-3 rounded-full ${iconBgColor} w-fit mb-3`}>
                    <Icon className={`h-8 w-8 ${iconTextColor}`}/>
                </div>
                <h3 className="font-semibold text-lg mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
