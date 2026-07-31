import "server-only";
import { sanityClient } from "./client";
import {
  notificationDetailQuery,
  notificationListQuery,
  notificationSlugsQuery,
} from "./queries";
import type { NotificationDetail, NotificationListItem } from "./types";

const options = { next: { revalidate: 300, tags: ["notifications"] } };

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

export function getNotificationSlugs() {
  return sanityClient.fetch<Array<{ slug: string }>>(
    notificationSlugsQuery,
    {},
    options,
  );
}
