"use client";
import {
    Bell,
    Mail,
    MessageSquare,
    Calendar,
    AlertCircle,
    Check,
} from "lucide-react";
import {motion} from "framer-motion";
import {formatDistanceToNow} from "date-fns";
import {fr} from "date-fns/locale";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {NotificationCardProps} from "../types";

export function NotificationCard({
                                     notification,
                                     onMarkAsRead,
                                     index,
                                 }: NotificationCardProps) {
    const getNotificationIcon = (type: string) => {
        const iconClass = "h-5 w-5";
        switch (type) {
            case "APPLICATION":
                return <Mail className={`${iconClass} text-blue-600`}/>;
            case "INTERVIEW":
                return <Calendar className={`${iconClass} text-green-600`}/>;
            case "MESSAGE":
                return <MessageSquare className={`${iconClass} text-purple-600`}/>;
            case "SYSTEM":
                return <AlertCircle className={`${iconClass} text-orange-600`}/>;
            default:
                return <Bell className={`${iconClass} text-gray-600`}/>;
        }
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.05 * index}}
        >
            <Card
                className={`transition-all hover:shadow-lg ${
                    !notification.read ? "border-l-4 border-l-blue-600" : ""
                }`}
            >
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <div
                                className={`p-2 rounded-lg ${
                                    notification.type === "APPLICATION_SUBMITTED"
                                        ? "bg-blue-100 dark:bg-blue-900/20"
                                        : notification.type === "INTERVIEW_SCHEDULED"
                                            ? "bg-green-100 dark:bg-green-900/20"
                                            : notification.type === "NEW_MESSAGE"
                                                ? "bg-purple-100 dark:bg-purple-900/20"
                                                : "bg-orange-100 dark:bg-orange-900/20"
                                }`}
                            >
                                {getNotificationIcon(notification.type)}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p
                                        className={`text-sm mb-1 ${
                                            !notification.read ? "font-semibold" : ""
                                        }`}
                                    >
                                        {notification.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {formatDistanceToNow(new Date(notification.created_at), {
                                            addSuffix: true,
                                            locale: fr,
                                        })}
                                    </p>
                                </div>

                                {!notification.read && (
                                    <Button
                                        onClick={() => onMarkAsRead(notification.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="flex-shrink-0"
                                    >
                                        <Check className="h-4 w-4"/>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
