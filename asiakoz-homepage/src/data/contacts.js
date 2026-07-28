import { BRANCH } from "../lib/branch";

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
      { display: "8 708 075 0180", href: "tel:+77080750180", tel: "+77080750180" },
      { display: "8 708 076 0180", href: "tel:+77080760180", tel: "+77080760180" },
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
    phones: [{ display: "+7 700 360 01 80", href: "tel:+77003600180", tel: "+77003600180" }],
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
    phones: [{ display: "+7 700 360 01 80", href: "tel:+77003600180", tel: "+77003600180" }],
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
    heroImage: "images/clinic-aktau.png",
    phones: [{ display: "8 775 863 0180", href: "tel:+77758630180", tel: "+77758630180" }],
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
      routeUrl:
        "https://2gis.kz/aktau/firm/70000001104276081/tab/routes",
      embedUrl:
        "https://2gis.kz/aktau/firm/70000001104276081?m=51.14388%2C43.65118%2F16",
    },
  },
  home: {
    name: "AsiaKoz",
    nameLatin: "AsiaKoz",
    typeKz: "Офтальмологиялық клиникалар желісі",
    typeRu: "Сеть офтальмологических клиник",
    city: "Алматы · Ақтау · Шымкент",
    cityRu: "Алматы · Актау · Шымкент",
    address: "Алматы, Райымбек даңғылы, 176А",
    addressRu: "Алматы, проспект Райымбека, 176А",
    addressKz: "Алматы, Райымбек даңғылы, 176А",
    heroImage: "images/clinic-almaty-laser.png",
    phones: [
      { display: "+7 700 360 01 80", href: "tel:+77003600180", tel: "+77003600180", labelKz: "Алматы", labelRu: "Алматы" },
      { display: "8 775 863 0180", href: "tel:+77758630180", tel: "+77758630180", labelKz: "Ақтау", labelRu: "Актау" },
      { display: "8 708 075 0180", href: "tel:+77080750180", tel: "+77080750180", labelKz: "Шымкент", labelRu: "Шымкент" },
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
};

export const CLINIC = CLINIC_BY_BRANCH[BRANCH] || CLINIC_BY_BRANCH.shymkent;

export function clinicAddress(lang = "kz") {
  if (lang === "ru" && CLINIC.addressRu) return CLINIC.addressRu;
  if (lang === "kz" && CLINIC.addressKz) return CLINIC.addressKz;
  return CLINIC.address;
}

export function waBookingUrl(lang = "kz", extra = "") {
  const cityName = CLINIC.city;
  const message =
    BRANCH === "laser"
      ? lang === "ru"
        ? "Здравствуйте! Хочу записаться на лазерную коррекцию зрения в AsiaKoz Алматы (акция)."
        : "Сәлеметсіз бе! AsiaKoz Алматы клиникасында көзді лазерлік түзетуге жазылғым келеді (акция)."
      : BRANCH === "home"
        ? lang === "ru"
          ? "Здравствуйте! Хочу записаться на приём в клинику AsiaKoz."
          : "Сәлеметсіз бе! AsiaKoz клиникасына қабылдауға жазылғым келеді."
        : lang === "ru"
          ? `Здравствуйте! Хочу записаться на приём в клинику AsiaKoz ${cityName}.`
          : `Сәлеметсіз бе! AsiaKoz ${cityName} клиникасына қабылдауға жазылғым келеді.`;
  const body = extra ? `${message}\n\n${extra}` : message;
  return `${CLINIC.whatsapp.url}?text=${encodeURIComponent(body)}`;
}
