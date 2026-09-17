/** Restrict the taxi page's editable CTA destinations to the existing forms. */
export function taxiCtaHref(value: string | undefined, fallback: "/contact" | "/request-quote"): string {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    try {
      const url = new URL(value, "https://roadlenz.invalid");
      if (url.origin === "https://roadlenz.invalid" && ["/contact", "/request-quote"].includes(url.pathname)) {
        return `${url.pathname}${url.search}`;
      }
    } catch { /* Render the existing form route if CMS input is invalid. */ }
  }
  return `${fallback}?solution=taxi`;
}
