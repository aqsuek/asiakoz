import { corporateHomeUrl, corporateNewsUrl } from "./routes";

/** Corporate homepage menu — used on every branch and page. */
export const CORPORATE_NAV_ITEMS = [
  { key: "about", hash: "#about" },
  { key: "services", hash: "#services" },
  { key: "doctors", hash: "#doctors" },
  { key: "reviews", hash: "#reviews" },
  { key: "news", href: corporateNewsUrl },
  { key: "contacts", hash: "#contacts" },
];

export function navItemHref(item) {
  if (typeof item.href === "function") return item.href();
  return corporateHomeUrl(item.hash);
}
