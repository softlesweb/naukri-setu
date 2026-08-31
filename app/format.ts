const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(value?: string, fallback = "Not specified") {
  return value ? dateFormatter.format(new Date(value)) : fallback;
}
