"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api/client";
import type { Notification } from "@/lib/types";
import { toast } from "sonner";

import { NotificationHeader } from "./NotificationHeader";
import { NotificationFilters } from "./NotificationFilters";
import { NotificationList } from "./NotificationList";

export function NotificationPageContainer() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    loadNotifications();
  }, [isAuthenticated, router]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast.error("Erreur", {
        description: "Impossible de charger les notifications",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.markNotificationAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      toast.success("Notification marquée comme lue");
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Erreur lors du marquage");
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.markAllNotificationsAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast.success("Toutes les notifications marquées comme lues");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Erreur lors du marquage");
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <main className="container mx-auto px-4 py-12">
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={markAllAsRead}
      />
      <NotificationFilters
        currentFilter={filter}
        onFilterChange={setFilter}
      />
      <NotificationList
        notifications={filteredNotifications}
        loading={loading}
        onMarkAsRead={markAsRead}
      />
    </main>
  );
}
