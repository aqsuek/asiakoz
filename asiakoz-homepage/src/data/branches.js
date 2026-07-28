/**
 * Single source of truth for AsiaKoz network branches (home city picker).
 * Per-build CLINIC in contacts.js stays for shymkent/aqtau/almaty/laser SPAs.
 */

export const BRANCH_IDS = ["almaty", "aqtau", "shymkent"];
export const DEFAULT_BRANCH_ID = "almaty";
export const CITY_STORAGE_KEY = "asiakoz-home-city";

/** @typedef {'open' | 'coming_soon'} BranchStatus */

/**
 * @type {Array<{
 *   id: string,
 *   status: BranchStatus,
 *   cityKz: string,
 *   cityRu: string,
 *   addressKz: string,
 *   addressRu: string,
 *   phoneDisplay: string,
 *   phoneTel: string,
 *   whatsapp: { number: string, url: string },
 *   instagram: { handle: string, url: string },
 *   gis: { searchUrl: string, routeUrl: string, embedUrl: string | null },
 *   pageHref: string,
 *   hoursKz: string | null,
 *   hoursRu: string | null,
 *   doctorCities: string[],
 * }>}
 */
export const NETWORK_BRANCHES = [
  {
    id: "almaty",
    status: "open",
    cityKz: "Алматы",
    cityRu: "Алматы",
    addressKz: "Алматы, Райымбек даңғылы, 176А",
    addressRu: "Алматы, проспект Райымбека, 176А",
    summaryKz: "Лазерлік көру түзету, катаракта, толық диагностика",
    summaryRu: "Лазерная коррекция, катаракта, полная диагностика",
    phoneDisplay: "+7 700 360 01 80",
    phoneTel: "+77003600180",
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
    // Existing hours from content.js (Almaty/Aktau)
    hoursKz: "Дс–Жм 09:00–17:00, Сб 14:00-ге дейін",
    hoursRu: "Пн–Пт 09:00–17:00, Сб до 14:00",
    doctorCities: ["almaty"],
  },
  {
    id: "aqtau",
    status: "open",
    cityKz: "Ақтау",
    cityRu: "Актау",
    addressKz: "Ақтау, 7А шағынауданы, 11/3",
    addressRu: "Актау, 7А микрорайон, 11/3",
    summaryKz: "Катаракта, тор қабық, балалар офтальмологиясы",
    summaryRu: "Катаракта, сетчатка, детская офтальмология",
    phoneDisplay: "+7 775 863 01 80",
    phoneTel: "+77758630180",
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
      embedUrl: "https://2gis.kz/aktau/firm/70000001104276081?m=51.14388%2C43.65118%2F16",
    },
    pageHref: "/aqtau/",
    hoursKz: "Дс–Жм 09:00–17:00, Сб 14:00-ге дейін",
    hoursRu: "Пн–Пт 09:00–17:00, Сб до 14:00",
    doctorCities: ["aqtau"],
  },
  {
    id: "shymkent",
    status: "coming_soon",
    cityKz: "Шымкент",
    cityRu: "Шымкент",
    addressKz: "Шымкент, Байтұрсынов көшесі, 86/7, Тұран",
    addressRu: "Шымкент, улица Байтурсынова, 86/7, Туран",
    summaryKz: "Жақында ашылады. Алдын ала жазылу жүріп жатыр",
    summaryRu: "Скоро открытие. Идет предварительная запись",
    phoneDisplay: "+7 708 075 01 80",
    phoneTel: "+77080750180",
    whatsapp: {
      number: "77080750180",
      url: "https://wa.me/77080750180",
    },
    instagram: {
      handle: "@asiakoz.shymkent",
      url: "https://www.instagram.com/asiakoz.shymkent/",
    },
    gis: {
      // Search-based URLs already used by shymkent clinic build
      searchUrl:
        "https://2gis.kz/shymkent/search/" +
        encodeURIComponent("Байтұрсынов көшесі, 86/7, Тұран, Шымкент"),
      routeUrl:
        "https://2gis.kz/shymkent/search/" +
        encodeURIComponent("Байтұрсынов көшесі, 86/7, Тұран, Шымкент") +
        "/tab/routes",
      embedUrl:
        "https://2gis.kz/shymkent/search/" +
        encodeURIComponent("Байтұрсынов көшесі, 86/7") +
        "?m=69.597%2C42.341%2F16",
    },
    pageHref: "/shymkent/",
    hoursKz: null,
    hoursRu: null,
    doctorCities: [], // reception not open yet — do not list doctors here
  },
];

export const MAIN_INSTAGRAM = {
  handle: "@asiakoz.clinic",
  url: "https://www.instagram.com/asiakoz.clinic/",
};

export function getNetworkBranch(id) {
  return NETWORK_BRANCHES.find((b) => b.id === id) || NETWORK_BRANCHES[0];
}

export function branchCityName(branch, lang = "kz") {
  return lang === "ru" ? branch.cityRu : branch.cityKz;
}

export function branchAddress(branch, lang = "kz") {
  return lang === "ru" ? branch.addressRu : branch.addressKz;
}

export function branchHours(branch, lang = "kz") {
  if (!branch) return null;
  return lang === "ru" ? branch.hoursRu : branch.hoursKz;
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
