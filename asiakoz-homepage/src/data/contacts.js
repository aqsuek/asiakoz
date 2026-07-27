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
};

export const CLINIC = CLINIC_BY_BRANCH[BRANCH] || CLINIC_BY_BRANCH.shymkent;

export function waBookingUrl(lang = "kz", extra = "") {
  const cityName = CLINIC.city;
  const message =
    lang === "ru"
      ? `Здравствуйте! Хочу записаться на приём в клинику AsiaKoz ${cityName}.`
      : `Сәлеметсіз бе! AsiaKoz ${cityName} клиникасына қабылдауға жазылғым келеді.`;
  const body = extra ? `${message}\n\n${extra}` : message;
  return `${CLINIC.whatsapp.url}?text=${encodeURIComponent(body)}`;
}
