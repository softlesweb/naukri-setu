import "server-only";
import { cache as reactCache } from "react";
import { sanityClient } from "./client";
import {
  notificationDetailQuery,
  notificationListQuery,
  notificationsByCategoryQuery,
} from "./queries";
import type { NotificationDetail, NotificationListItem } from "./types";

// Cache Sanity responses briefly so repeat page views don't refetch, while
// newly published Studio content still appears within a minute.
const options = { next: { revalidate: 60 } };

export function getNotifications() {
  return sanityClient.fetch<NotificationListItem[]>(
    notificationListQuery,
    {},
    options,
  );
}

export function getNotificationsByCategory(category: string) {
  return sanityClient.fetch<NotificationListItem[]>(
    notificationsByCategoryQuery,
    { category },
    options,
  );
}

// Deduped per request: generateMetadata and the page both call this.
export const getNotification = reactCache((slug: string) =>
  sanityClient.fetch<NotificationDetail | null>(
    notificationDetailQuery,
    { slug },
    options,
  ),
);
