import { Notification } from "@/lib/types";

export interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export interface NotificationFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export interface NotificationCardProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    index: number;
}



export interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
}
