import "server-only";
import { sanityClient } from "./client";
import { notificationDetailQuery, notificationListQuery } from "./queries";
import type { NotificationDetail, NotificationListItem } from "./types";

const options = { cache: "no-store" as const };

export function getNotifications() {
  return sanityClient.fetch<NotificationListItem[]>(
    notificationListQuery,
    {},
    options,
  );
}

export function getNotification(slug: string) {
  return sanityClient.fetch<NotificationDetail | null>(
    notificationDetailQuery,
    { slug },
    options,
  );
}
