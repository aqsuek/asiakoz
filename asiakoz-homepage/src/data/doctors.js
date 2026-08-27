/**
 * Structured doctors registry — single source for SPA + static SEO scripts.
 * Keep in sync with /data/doctors.json
 */
export const NETWORK_DOCTORS = [
  {
    id: "orel-talip",
    href: "/doctor-orel/",
    nameRu: "Орел Талип",
    nameKz: "Орел Талип",
    roleRu: "Витреоретинолог, офтальмолог-хирург",
    roleKz: "Витреоретинолог, офтальмолог-хирург",
    cities: ["almaty"],
    image: "images/doctors/orel-talip.png",
  },
  {
    id: "mehmet-esat-teker",
    href: "/doctor-mehmet-esat-teker/",
    nameRu: "Мехмет Есат Текер",
    nameKz: "Мехмет Есат Текер",
    roleRu: "Офтальмолог-хирург",
    roleKz: "Офтальмолог-хирург",
    cities: ["almaty"],
    image: "images/doctors/mehmet-esat-teker.png",
    fromTurkey: true,
  },
  {
    id: "aliya",
    href: "/doctor-aliya/",
    nameRu: "Алия Усманова",
    nameKz: "Алия Усманова",
    roleRu: "Офтальмохирург",
    roleKz: "Офтальмохирург",
    cities: ["almaty"],
    image: "images/doctors/aliya.png",
  },
  {
    id: "musay",
    href: "/doctor-musay/",
    nameRu: "Нұрмұхамед Мусай",
    nameKz: "Нұрмұхамед Мусай",
    roleRu: "Главный врач",
    roleKz: "Бас дәрігер",
    cities: ["almaty"],
    image: "images/doctors/musay.png",
  },
  {
    id: "ali-keskin",
    href: "/doctor-ali-keskin/",
    nameRu: "Али Кескин",
    nameKz: "Али Кескин",
    roleRu: "Офтальмолог-хирург",
    roleKz: "Офтальмолог-хирург",
    cities: ["aqtau"],
    image: "images/doctors/ali-keskin.png",
    fromTurkey: true,
  },
  {
    id: "erol-joshkun",
    href: "/doctor-erol/",
    nameRu: "Эрол Джошкун",
    nameKz: "Эрол Джошкун",
    roleRu: "Офтальмолог-хирург",
    roleKz: "Офтальмолог-хирург",
    cities: ["aqtau"],
    image: "images/doctors/erol-joshkun.png",
  },
  {
    id: "nazgul-sagyndykova",
    href: "/doctor-nazgul/",
    nameRu: "Назгуль Сагындыкова",
    nameKz: "Назгүл Сағындықова",
    roleRu: "Врач-офтальмолог",
    roleKz: "Дәрігер-офтальмолог",
    cities: ["aqtau"],
    image: "images/doctors/nazgul-sagyndykova.png",
  },
  {
    id: "kadyr-kyrboga",
    href: "/shymkent/doctor/kadyr-kyrboga/",
    nameRu: "Кадыр Кырбога",
    nameKz: "Қадыр Қырбога",
    roleRu: "Витреоретинальный хирург",
    roleKz: "Витреоретиналды хирург",
    cities: ["shymkent"],
    image: "images/doctors/kadyr-kyrboga.png",
    fromTurkey: true,
  },
];

export function doctorsForCity(cityId) {
  if (!cityId) return NETWORK_DOCTORS;
  return NETWORK_DOCTORS.filter((d) => d.cities.includes(cityId));
}

export function doctorDisplayName(doctor, lang = "kz") {
  return lang === "ru" ? doctor.nameRu : doctor.nameKz;
}

export function doctorRole(doctor, lang = "kz") {
  return lang === "ru" ? doctor.roleRu : doctor.roleKz;
}
