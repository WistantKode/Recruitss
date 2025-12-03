"use client";

import {motion} from "framer-motion";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {RecruiterStatCardProps} from "../types";

export function RecruiterStatCard({
                                      title,
                                      value,
                                      description,
                                      icon: Icon,
                                      iconBgColor,
                                      iconTextColor,
                                      delay,
                                  }: RecruiterStatCardProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay}}
        >
            <Card className="border-2 hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    <div className={`h-10 w-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${iconTextColor}`}/>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
