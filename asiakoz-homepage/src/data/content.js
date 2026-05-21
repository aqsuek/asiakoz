export const WHATSAPP_URL =
  "https://wa.me/77008880180?text=" +
  encodeURIComponent("Здравствуйте! Хочу записаться в клинику AsiaKoz.");

export const PHONE_ALMATY = "+7 777 888 01 80";
export const PHONE_ALMATY_HREF = "tel:+77778880180";
export const PHONE_AKTau = "+7 775 863 01 80";
export const PHONE_AKTau_HREF = "tel:+77758630180";

export const NAV_LINKS = [
  { label: "Услуги", href: "/uslugi/" },
  { label: "О клинике", href: "/glaznaya-klinika-almaty/" },
  { label: "Врачи", href: "/doctors/" },
  { label: "Отзывы", href: "/otzyvy-asiakoz-almaty/" },
  { label: "Пациентам", href: "#process" },
  { label: "Контакты", href: "#contacts" },
];

export const HERO_FEATURES = [
  "Турецкие офтальмохирурги",
  "Современное оборудование",
  "Международные стандарты",
];

export const TRUST_STATS = [
  { value: "12 000+", label: "успешных операций", icon: "award" },
  { value: "900+", label: "отзывов пациентов", icon: "message" },
  { value: "2", label: "филиала в Казахстане", icon: "map" },
];

export const SERVICES = [
  {
    title: "Косоглазие",
    description:
      "Хирургическое лечение у детей и взрослых с индивидуальным планом коррекции.",
    icon: "eye",
    href: "/kosoglazie/",
  },
  {
    title: "Витрэктомия",
    description:
      "Операции на сетчатке и стекловидном теле при сложных офтальмологических случаях.",
    icon: "scan",
    href: "/vitrektomiya-almaty/",
  },
  {
    title: "Катаракта",
    description:
      "Факоэмульсификация с имплантацией ИОЛ — быстрое восстановление зрения.",
    icon: "sparkles",
    href: "/katarakta-almaty/",
  },
  {
    title: "Лазерная коррекция",
    description:
      "LASIK и SMILE для снижения зависимости от очков и линз.",
    icon: "zap",
    href: "/lazer-almaty/",
  },
  {
    title: "Глаукома",
    description:
      "Диагностика и лечение для сохранения зрительного нерва и поля зрения.",
    icon: "activity",
    href: "/glaukoma-almaty/",
  },
];

export const DOCTORS = [
  {
    name: "Мухаммед Горгани",
    role: "Офтальмохирург",
    specialty: "Лазерная коррекция, катаракта, глаукома",
    image: "/images/doctor-gargoni.png",
    href: "/doctor-gorgani/",
  },
  {
    name: "Орел Талип",
    role: "Витреоретинолог",
    specialty: "Витрэктомия, сетчатка, косоглазие",
    image: "/images/doctor-orel.png",
    href: "/doctor-orel/",
  },
  {
    name: "Эрол Джошкун",
    role: "Офтальмолог-хирург",
    specialty: "Косоглазие, катаракта, глаукома · филиал Актау",
    image: "/images/doctor-erol.png",
    href: "/doctor-erol/",
  },
];

export const WHY_CHOOSE = [
  {
    title: "Опыт и экспертиза",
    description: "Тысячи операций и сложные клинические случаи.",
    icon: "shield",
  },
  {
    title: "Современные технологии",
    description: "Диагностика и хирургия на оборудовании мирового уровня.",
    icon: "cpu",
  },
  {
    title: "Турецкие специалисты",
    description: "Хирурги с международной практикой и стажем.",
    icon: "globe",
  },
  {
    title: "Индивидуальный подход",
    description: "Персональный план лечения после полной диагностики.",
    icon: "user",
  },
  {
    title: "Международные стандарты",
    description: "Протоколы безопасности и контроля качества.",
    icon: "badge",
  },
];

export const PROCESS_STEPS = [
  {
    step: 1,
    title: "Диагностика",
    description: "Полное обследование зрения и консультация врача.",
  },
  {
    step: 2,
    title: "План лечения",
    description: "Подбор оптимального метода с учётом вашего случая.",
  },
  {
    step: 3,
    title: "Операция",
    description: "Процедура в операционной под контролем хирурга.",
  },
  {
    step: 4,
    title: "Реабилитация",
    description: "Наблюдение и рекомендации для стабильного результата.",
  },
];

export const REVIEWS = [
  {
    text: "Долго не решалась на операцию по катаракте. В AsiaKoz всё объяснили, операция прошла быстро и без боли. Спасибо врачу из Турции!",
    name: "Пациентка, 63 года",
    city: "Алматы",
    rating: 5,
  },
  {
    text: "Делал лазерную коррекцию. На следующий день уже видел без очков. Отношение персонала внимательное.",
    name: "Пациент, 29 лет",
    city: "Алматы",
    rating: 5,
  },
  {
    text: "Привели маму с глаукомой. Врачи объяснили варианты лечения. Давление под контролем.",
    name: "Дочь пациентки",
    city: "Алматы",
    rating: 5,
  },
];

export const BRANCHES = [
  {
    city: "Алматы",
    address: "пр. Райымбека, 176А",
    phone: "+7 700 888 01 80",
    phoneAlt: "+7 777 888 01 80",
    phoneHref: "tel:+77008880180",
    phoneAltHref: "tel:+77778880180",
    whatsapp: "https://wa.me/77008880180",
    hours: "Пн–Пт 09:00–17:00, Сб до 14:00",
    image: "/images/clinic-building.png",
    gis: "https://2gis.kz/kk/almaty/firm/70000001081905733",
  },
  {
    city: "Актау",
    address: "7А микрорайон, 11/3",
    phone: "+7 775 863 01 80",
    phoneHref: "tel:+77758630180",
    whatsapp: "https://wa.me/77758630180",
    hours: "Пн–Пт 09:00–17:00, Сб до 14:00",
    image: "/images/clinic-2.png",
    gis: "https://2gis.kz/aktau/firm/70000001104276081",
  },
];
