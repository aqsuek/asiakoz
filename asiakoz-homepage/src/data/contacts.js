import { BRANCH, IS_HOME } from "../lib/branch";
import {
  NETWORK_BRANCHES,
  branchAddress,
  branchCityName,
  formatKzPhoneDisplay,
  getNetworkBranch,
  phoneHref,
} from "./branches";

const CLINIC_BY_BRANCH = {
  shymkent: {
    name: "Азиякөз",
    nameLatin: "AsiaKoz",
    typeKz: "Офтальмологиялық орталық",
    typeRu: "Офтальмологический центр",
    city: "Шымкент",
    address: "Байтұрсынов көшесі, 86/7, Тұран, Шымкент",
    heroImage: "images/shymkent-branch.png",
    phones: [
      {
        display: formatKzPhoneDisplay("+77080750180"),
        href: "tel:+77080750180",
        tel: "+77080750180",
      },
      {
        display: formatKzPhoneDisplay("+77080760180"),
        href: "tel:+77080760180",
        tel: "+77080760180",
      },
    ],
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
      embedUrl:
        "https://2gis.kz/shymkent/search/" +
        encodeURIComponent("Байтұрсынов көшесі, 86/7") +
        "?m=69.597%2C42.341%2F16",
    },
  },
  almaty: {
    name: "Азиякөз",
    nameLatin: "AsiaKoz",
    typeKz: "Офтальмологиялық орталық",
    typeRu: "Офтальмологический центр",
    city: "Алматы",
    address: "Алматы, Райымбек даңғылы, 176А",
    addressRu: "Алматы, проспект Райымбека, 176А",
    addressKz: "Алматы, Райымбек даңғылы, 176А",
    heroImage: "images/clinic-almaty-laser.png",
    phones: [
      {
        display: formatKzPhoneDisplay("+77003600180"),
        href: "tel:+77003600180",
        tel: "+77003600180",
      },
    ],
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
  },
  laser: {
    name: "Азиякөз",
    nameLatin: "AsiaKoz",
    typeKz: "Офтальмологиялық орталық",
    typeRu: "Офтальмологический центр",
    city: "Алматы",
    address: "Алматы, Райымбек даңғылы, 176А",
    addressRu: "Алматы, проспект Райымбека, 176А",
    addressKz: "Алматы, Райымбек даңғылы, 176А",
    heroImage: "images/clinic-almaty-laser.png",
    phones: [
      {
        display: formatKzPhoneDisplay("+77003600180"),
        href: "tel:+77003600180",
        tel: "+77003600180",
      },
    ],
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
  },
  aqtau: {
    name: "Азиякөз",
    nameLatin: "AsiaKoz",
    typeKz: "Офтальмологиялық орталық",
    typeRu: "Офтальмологический центр",
    city: "Ақтау",
    address: "7А шағынауданы, 11/3, Ақтау",
    addressRu: "Актау, 7А микрорайон, 11/3",
    addressKz: "Ақтау, 7А шағынауданы, 11/3",
    heroImage: "images/clinic-aktau.png",
    phones: [
      {
        display: formatKzPhoneDisplay("+77758630180"),
        href: "tel:+77758630180",
        tel: "+77758630180",
      },
    ],
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
  },
  home: {
    name: "AsiaKoz",
    nameLatin: "AsiaKoz",
    typeKz: "Офтальмологиялық клиникалар желісі",
    typeRu: "Сеть офтальмологических клиник",
    city: "Алматы · Ақтау",
    cityRu: "Алматы · Актау",
    address: "Алматы, Райымбек даңғылы, 176А",
    addressRu: "Алматы, проспект Райымбека, 176А",
    addressKz: "Алматы, Райымбек даңғылы, 176А",
    heroImage: "images/clinic-almaty-laser.png",
    phones: NETWORK_BRANCHES.map((b) => ({
      display: b.phoneDisplay,
      href: phoneHref(b.phoneTel),
      tel: b.phoneTel,
      labelKz: b.cityKz,
      labelRu: b.cityRu,
      branchId: b.id,
    })),
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
  },
};

export const CLINIC = CLINIC_BY_BRANCH[BRANCH] || CLINIC_BY_BRANCH.shymkent;

export function clinicAddress(lang = "kz") {
  if (lang === "ru" && CLINIC.addressRu) return CLINIC.addressRu;
  if (lang === "kz" && CLINIC.addressKz) return CLINIC.addressKz;
  return CLINIC.address;
}

/**
 * Build WhatsApp booking URL.
 * @param {string} lang
 * @param {string} [extra]
 * @param {{ branchId?: string | null }} [opts]
 */
export function waBookingUrl(lang = "kz", extra = "", opts = {}) {
  const branchId = opts.branchId || null;
  const network = branchId ? getNetworkBranch(branchId) : null;
  const waUrl = network?.whatsapp?.url || CLINIC.whatsapp.url;
  const cityName = network
    ? branchCityName(network, lang)
    : CLINIC.city;

  let message;
  if (BRANCH === "laser") {
    message =
      lang === "ru"
        ? "Здравствуйте! Хочу записаться на лазерную коррекцию зрения в AsiaKoz Алматы (акция)."
        : "Сәлеметсіз бе! AsiaKoz Алматы клиникасында көзді лазерлік түзетуге жазылғым келеді (акция).";
  } else if (IS_HOME && network?.status === "coming_soon") {
    message =
      lang === "ru"
        ? "Здравствуйте! Хочу оставить предварительную заявку на открытие филиала AsiaKoz в Шымкенте."
        : "Сәлеметсіз бе! AsiaKoz Шымкент филиалының ашылуына алдын ала өтінім қалдырғым келеді.";
  } else if (IS_HOME && network) {
    message =
      lang === "ru"
        ? "Здравствуйте! Хочу записаться в AsiaKoz."
        : "Сәлеметсіз бе! AsiaKoz клиникасына жазылғым келеді.";
    if (!extra) {
      message +=
        lang === "ru" ? `\n\nГород: ${cityName}` : `\n\nҚала: ${cityName}`;
    }
  } else if (BRANCH === "home") {
    message =
      lang === "ru"
        ? "Здравствуйте! Хочу записаться в AsiaKoz."
        : "Сәлеметсіз бе! AsiaKoz клиникасына жазылғым келеді.";
  } else {
    message =
      lang === "ru"
        ? `Здравствуйте! Хочу записаться на приём в клинику AsiaKoz ${cityName}.`
        : `Сәлеметсіз бе! AsiaKoz ${cityName} клиникасына қабылдауға жазылғым келеді.`;
  }

  const body = extra ? `${message}\n\n${extra}` : message;
  return `${waUrl}?text=${encodeURIComponent(body)}`;
}

export function networkBranchAddress(branchId, lang = "kz") {
  return branchAddress(getNetworkBranch(branchId), lang);
}
