export const PHONE = "+7 700 360 01 80";
export const PHONE_HREF = "tel:+77008880180";
export const WHATSAPP_URL =
  "https://wa.me/77003600180?text=" +
  encodeURIComponent("Здравствуйте! Хочу записаться в клинику Азиякоз.");

export const PHONE_ALMATY = PHONE;
export const PHONE_ALMATY_HREF = PHONE_HREF;
export const PHONE_AKTau = "+7 775 863 01 80";
export const PHONE_AKTau_HREF = "tel:+77758630180";
export const WHATSAPP_AKTau_URL =
  "https://wa.me/77758630180?text=" +
  encodeURIComponent("Здравствуйте! Хочу записаться в клинику Азиякоз Актау.");

export const NAV_LINKS = [
  { label: "Услуги", href: "/uslugi/" },
  { label: "Врачи", href: "#doctors" },
  { label: "О клинике", href: "#about" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Контакты", href: "#contacts" },
];

export const HERO_DOCTORS = [
  {
    name: "Орел Талип",
    role: "Витреоретинолог",
    branch: "Алматы",
    tags: ["Косоглазие", "Витрэктомия", "Сетчатка"],
    experience: "20+ лет · 15 000+ операций",
    rating: "4.8",
    image: "/images/doctor-orel.png",
    href: "/doctor-orel/",
  },
  {
    name: "Мехмет Есат Текер",
    role: "Ведущий офтальмолог-хирург",
    branch: "Алматы · Шымкент",
    tags: ["LASIK / SMILE", "Катаракта", "Витрэктомия"],
    experience: "20+ лет · специалист из Турции",
    rating: "4.8",
    image: "/images/doctor-mehmet-esat-teker.png",
    href: "/doctor-mehmet-esat-teker/",
  },
  {
    name: "Эрол Джошкун",
    role: "Офтальмолог-хирург",
    branch: "Ақтау",
    tags: ["Косоглазие", "Катаракта", "Глаукома"],
    experience: "15+ лет · клиники Турции",
    rating: "4.9",
    image: "/images/doctor-erol.png",
    href: "/doctor-erol/",
  },
  {
    name: "Алия Усманова",
    role: "Ведущий офтальмохирург",
    branch: "Алматы",
    tags: ["Лазерная коррекция", "Катаракта", "Блефаропластика"],
    experience: "18 лет стажа",
    rating: "4.8",
    image: "/images/doctor-aliya.png",
    href: "/doctor-aliya/",
  },
];

export const TRUST_STATS = [
  { value: "12 000+", label: "успешных операций" },
  { value: "4.8–4.9", label: "рейтинг в 2ГИС" },
  { value: "900+", label: "отзывов пациентов" },
  { value: "3", label: "филиала в Казахстане" },
];

export const SERVICES = [
  {
    title: "Лазерная коррекция",
    description: "LASIK и SMILE — современные методы коррекции зрения с быстрым восстановлением.",
    icon: "zap",
    href: "/lazer-almaty/",
    featured: true,
  },
  {
    title: "Косоглазие",
    description: "Хирургическое лечение у детей и взрослых с индивидуальным планом.",
    icon: "eye",
    href: "/kosoglazie/",
    featured: true,
  },
  {
    title: "Катаракта",
    description: "Факоэмульсификация с имплантацией ИОЛ премиум-класса.",
    icon: "sparkles",
    href: "/katarakta-almaty/",
  },
  {
    title: "Витрэктомия",
    description: "Операции на сетчатке и стекловидном теле при сложных случаях.",
    icon: "scan",
    href: "/vitrektomiya-almaty/",
  },
  {
    title: "Глаукома",
    description: "Диагностика и лечение для сохранения зрительного нерва.",
    icon: "activity",
    href: "/glaukoma-almaty/",
  },
];

export const DOCTORS = [
  {
    name: "Али Кескин",
    role: "Ведущий офтальмолог-хирург",
    branch: "aktau",
    tags: ["Макула", "Косоглазие", "Сетчатка"],
    image: "/images/doctor-ali-keskin.png",
    href: "/doctor-ali-keskin/",
  },
  {
    name: "Мехмет Есат Текер",
    role: "Ведущий офтальмолог-хирург",
    branch: "almaty",
    tags: ["LASIK / SMILE", "Катаракта", "Витрэктомия"],
    image: "/images/doctor-mehmet-esat-teker.png",
    href: "/doctor-mehmet-esat-teker/",
  },
  {
    name: "Орел Талип",
    role: "Витреоретинолог, офтальмолог-хирург",
    branch: "almaty",
    tags: ["Косоглазие", "Витрэктомия", "Сетчатка"],
    image: "/images/doctor-orel.png",
    href: "/doctor-orel/",
  },
  {
    name: "Эрол Джошкун",
    role: "Офтальмолог-хирург",
    branch: "aktau",
    tags: ["Косоглазие", "Катаракта", "Глаукома"],
    image: "/images/doctor-erol.png",
    href: "/doctor-erol/",
  },
  {
    name: "Алия Усманова",
    role: "Ведущий офтальмохирург высшей категории",
    branch: "almaty",
    tags: ["Лазерная коррекция", "Катаракта", "Блефаропластика"],
    image: "/images/doctor-aliya.png",
    href: "/doctor-aliya/",
  },
  {
    name: "Нұрмұхамед Мусай",
    role: "Главный врач",
    branch: "almaty",
    tags: ["Главный врач", "Сложные случаи"],
    image: "/images/doctor-musay.png",
    href: "/doctor-musay/",
  },
  {
    name: "Назгуль Сагындыкова",
    role: "Врач-офтальмолог",
    branch: "aktau",
    tags: ["Взрослые и дети", "Лазерная хирургия", "Оптометрия"],
    image: "/images/doctor-nazgul.png",
    href: "/doctor-nazgul/",
  },
  {
    name: "Мадина Тореханова",
    role: "Врач-офтальмолог",
    branch: "aktau",
    tags: ["Взрослые и дети", "Диагностика"],
    image: "/images/doctor-madina.png",
    href: "/doctor-madina/",
  },
];

export const WHY_CHOOSE = [
  {
    title: "Турецкие хирурги",
    description: "Специалисты с опытом в Турции и международной практикой.",
    icon: "globe",
  },
  {
    title: "12 000+ операций",
    description: "Тысячи успешных вмешательств и сложных клинических случаев.",
    icon: "award",
  },
  {
    title: "Современное оборудование",
    description: "Диагностика и хирургия на аппаратуре мирового уровня.",
    icon: "cpu",
  },
  {
    title: "Индивидуальный план",
    description: "Персональный подход после полной диагностики зрения.",
    icon: "user",
  },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Диагностика",
    description: "Полное обследование зрения и консультация врача.",
  },
  {
    step: "02",
    title: "План лечения",
    description: "Подбор оптимального метода с учётом вашего случая.",
  },
  {
    step: "03",
    title: "Операция",
    description: "Процедура в операционной под контролем хирурга.",
  },
  {
    step: "04",
    title: "Наблюдение",
    description: "Реабилитация и рекомендации для стабильного результата.",
  },
];

export const REVIEWS = [
  {
    text: "Долго не решалась на операцию по катаракте. В Азиякоз всё объяснили, операция прошла быстро и без боли. Спасибо врачу из Турции!",
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
    address: "Райымбек 176а Алматы",
    phone: PHONE,
    phoneHref: PHONE_HREF,
    whatsapp: WHATSAPP_URL,
    hours: "Пн–Пт 09:00–17:00, Сб до 14:00",
    image: "/images/clinic-building.png",
    gis: "https://2gis.kz/kk/almaty/firm/70000001081905733",
    rating: "4.8",
  },
  {
    city: "Ақтау",
    address: "7А микрорайон, 11/3",
    phone: PHONE_AKTau,
    phoneHref: PHONE_AKTau_HREF,
    whatsapp: WHATSAPP_AKTau_URL,
    hours: "Пн–Пт 09:00–17:00, Сб до 14:00",
    image: "/images/clinic-2.png",
    gis: "https://2gis.kz/aktau/firm/70000001104276081",
    rating: "4.9",
  },
];
