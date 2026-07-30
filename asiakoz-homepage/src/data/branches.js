/**
 * Single source of truth for AsiaKoz network branches.
 * Keep in sync with /data/branches.json (used by SEO scripts).
 *
 * URL note: Aktau RU canonical path is `/aktau/`; legacy `/aqtau/` redirects to `/aktau/`.
 * Confirmed marketing slug is `aktau`; `/aqtau/` redirects to `/aktau/`.
 */

export const BRANCH_IDS = ["almaty", "aqtau", "shymkent"];
export const DEFAULT_BRANCH_ID = "almaty";
export const CITY_STORAGE_KEY = "asiakoz-home-city";

/** @typedef {'active' | 'coming-soon'} BranchStatus */

/**
 * @type {Array<{
 *   id: string,
 *   slug: string,
 *   status: BranchStatus,
 *   nameKz: string,
 *   nameRu: string,
 *   cityKz: string,
 *   cityRu: string,
 *   addressKz: string,
 *   addressRu: string,
 *   phoneDisplay: string,
 *   phoneTel: string,
 *   phoneRaw: string,
 *   whatsapp: { number: string, url: string },
 *   instagram: { handle: string, url: string },
 *   gis: { searchUrl: string, routeUrl: string, embedUrl: string | null },
 *   pageHref: string,
 *   kkHref: string,
 *   hoursKz: string | null,
 *   hoursRu: string | null,
 *   doctorCities: string[],
 *   statusTextRu?: string,
 *   statusTextKz?: string,
 *   geo?: { latitude: number, longitude: number } | null,
 * }>}
 */
export const NETWORK_BRANCHES = [
  {
    id: "almaty",
    slug: "almaty",
    status: "active",
    nameKz: "AsiaKoz Алматы",
    nameRu: "AsiaKoz Алматы",
    cityKz: "Алматы",
    cityRu: "Алматы",
    addressKz: "Алматы, Райымбек даңғылы, 176А",
    addressRu: "Алматы, проспект Райымбека, 176А",
    summaryKz: "Лазерлік көру түзету, катаракта, толық диагностика",
    summaryRu: "Лазерная коррекция, катаракта, полная диагностика",
    phoneDisplay: "+7 700 360 01 80",
    phoneTel: "+77003600180",
    phoneRaw: "77003600180",
    whatsapp: {
      number: "77003600180",
      url: "https://wa.me/77003600180",
    },
    instagram: {
      handle: "@asiakoz.clinic",
      url: "https://www.instagram.com/asiakoz.clinic/",
    },
    gis: {
      searchUrl: "https://2gis.kz/kk/almaty/firm/70000001081905733",
      routeUrl: "https://2gis.kz/kk/almaty/firm/70000001081905733/tab/routes",
      embedUrl: "https://2gis.kz/kk/almaty/firm/70000001081905733?m=76.945%2C43.238%2F16",
    },
    pageHref: "/almaty/",
    kkHref: "/kk/almaty/",
    hoursKz: "Дс–Жм 09:00–17:00, Сб 14:00-ге дейін",
    hoursRu: "Пн–Пт 09:00–17:00, Сб до 14:00",
    geo: { latitude: 43.238, longitude: 76.945 },
    doctorCities: ["almaty"],
  },
  {
    id: "aqtau",
    slug: "aktau",
    status: "active",
    nameKz: "AsiaKoz Ақтау",
    nameRu: "AsiaKoz Актау",
    cityKz: "Ақтау",
    cityRu: "Актау",
    addressKz: "Ақтау, 7А шағынауданы, 11/3",
    addressRu: "Актау, 7А микрорайон, 11/3",
    summaryKz: "Катаракта, тор қабық, балалар офтальмологиясы",
    summaryRu: "Катаракта, сетчатка, детская офтальмология",
    phoneDisplay: "+7 775 863 01 80",
    phoneTel: "+77758630180",
    phoneRaw: "77758630180",
    whatsapp: {
      number: "77758630180",
      url: "https://wa.me/77758630180",
    },
    instagram: {
      handle: "@asiakoz.clinic",
      url: "https://www.instagram.com/asiakoz.clinic/",
    },
    gis: {
      searchUrl: "https://2gis.kz/aktau/firm/70000001104276081",
      routeUrl: "https://2gis.kz/aktau/firm/70000001104276081/tab/routes",
      embedUrl:
        "https://2gis.kz/aktau/firm/70000001104276081?m=51.14388%2C43.65118%2F16",
    },
    pageHref: "/aktau/",
    kkHref: "/kk/aqtau/",
    hoursKz: "Дс–Жм 09:00–17:00, Сб 14:00-ге дейін",
    hoursRu: "Пн–Пт 09:00–17:00, Сб до 14:00",
    geo: { latitude: 43.65118, longitude: 51.14388 },
    doctorCities: ["aqtau"],
  },
  {
    id: "shymkent",
    slug: "shymkent",
    status: "coming-soon",
    nameKz: "AsiaKoz Шымкент",
    nameRu: "AsiaKoz Шымкент",
    cityKz: "Шымкент",
    cityRu: "Шымкент",
    addressKz: "Шымкент, Байтұрсынов көшесі, 86/7, Тұран",
    addressRu: "Шымкент, улица Байтурсынова, 86/7, мкр. Туран",
    summaryKz: "Жақында ашылады. Алдын ала жазылу жүріп жатыр",
    summaryRu: "Скоро открытие. Идёт предварительная запись",
    statusTextKz: "Жақында ашылады. Алдын ала жазылу жүріп жатыр",
    statusTextRu: "Скоро открытие. Идёт предварительная запись",
    phoneDisplay: "+7 708 075 01 80",
    phoneTel: "+77080750180",
    phoneRaw: "77080750180",
    whatsapp: {
      number: "77080750180",
      url: "https://wa.me/77080750180",
    },
    instagram: {
      handle: "@asiakoz.shymkent",
      url: "https://www.instagram.com/asiakoz.shymkent/",
    },
    gis: {
      searchUrl:
        "https://2gis.kz/shymkent/search/" +
        encodeURIComponent("Байтұрсынов көшесі, 86/7, Тұран, Шымкент"),
      routeUrl:
        "https://2gis.kz/shymkent/search/" +
        encodeURIComponent("Байтұрсынов көшесі, 86/7, Тұран, Шымкент") +
        "/tab/routes",
      embedUrl: null,
    },
    pageHref: "/shymkent/",
    kkHref: "/kk/shymkent/",
    hoursKz: null,
    hoursRu: null,
    geo: null,
    doctorCities: [],
  },
];

export const MAIN_INSTAGRAM = {
  handle: "@asiakoz.clinic",
  url: "https://www.instagram.com/asiakoz.clinic/",
};

/** @deprecated use status === 'active' */
export function isBranchOpen(branch) {
  return branch?.status === "active" || branch?.status === "open";
}

export function isComingSoon(branch) {
  return branch?.status === "coming-soon" || branch?.status === "coming_soon";
}

export function getNetworkBranch(id) {
  return NETWORK_BRANCHES.find((b) => b.id === id || b.slug === id) || NETWORK_BRANCHES[0];
}

export function branchCityName(branch, lang = "kz") {
  return lang === "ru" ? branch.cityRu : branch.cityKz;
}

export function branchName(branch, lang = "kz") {
  return lang === "ru" ? branch.nameRu : branch.nameKz;
}

export function branchAddress(branch, lang = "kz") {
  return lang === "ru" ? branch.addressRu : branch.addressKz;
}

export function branchHours(branch, lang = "kz") {
  if (!branch) return null;
  return lang === "ru" ? branch.hoursRu : branch.hoursKz;
}

export function branchStatusText(branch, lang = "kz") {
  if (!isComingSoon(branch)) return null;
  return lang === "ru"
    ? branch.statusTextRu || branch.summaryRu
    : branch.statusTextKz || branch.summaryKz;
}

/** Format any tel string to `+7 XXX XXX XX XX` */
export function formatKzPhoneDisplay(telOrDisplay) {
  const digits = String(telOrDisplay || "").replace(/\D/g, "");
  let n = digits;
  if (n.length === 11 && n.startsWith("8")) n = `7${n.slice(1)}`;
  if (n.length === 10) n = `7${n}`;
  if (n.length !== 11 || !n.startsWith("7")) return telOrDisplay;
  return `+7 ${n.slice(1, 4)} ${n.slice(4, 7)} ${n.slice(7, 9)} ${n.slice(9, 11)}`;
}

export function phoneHref(tel) {
  const digits = String(tel || "").replace(/\D/g, "");
  let n = digits;
  if (n.length === 11 && n.startsWith("8")) n = `7${n.slice(1)}`;
  if (n.length === 10) n = `7${n}`;
  return `tel:+${n}`;
}
