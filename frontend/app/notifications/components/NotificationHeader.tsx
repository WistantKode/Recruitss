"use client";

import {Bell, CheckCheck} from "lucide-react";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {NotificationHeaderProps} from "../types";

export function NotificationHeader({
                                       unreadCount,
                                       onMarkAllAsRead,
                                   }: NotificationHeaderProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="mb-12"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <Bell className="h-10 w-10 text-blue-600"/>
                        Notifications
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {unreadCount > 0 ? (
                            <Badge variant="warning" className="mr-2">
                                {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                            </Badge>
                        ) : (
                            "Aucune notification non lue"
                        )}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={onMarkAllAsRead} variant="outline">
                        <CheckCheck className="mr-2 h-4 w-4"/>
                        Tout marquer comme lu
                    </Button>
                )}
            </div>
        </motion.div>
    );
}
