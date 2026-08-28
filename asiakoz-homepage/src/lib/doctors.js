import { doctorProfileUrl } from "./routes";

let cache = null;
let cacheTs = 0;
const TTL = 60_000;

export function localizeDoctor(raw, lang = "ru") {
  if (!raw) return null;
  const ru = lang === "ru";
  const profileUrl = ru
    ? raw.profileUrl || doctorProfileUrl(raw.id, "ru")
    : raw.profileUrlKz || doctorProfileUrl(raw.id, "kz");
  return {
    id: raw.id,
    cities: raw.cities || [],
    profileUrl,
    image: raw.image || "",
    name: ru ? raw.nameRu : raw.nameKz || raw.nameRu,
    branch: ru ? raw.branchRu : raw.branchKz || raw.branchRu,
    role: ru ? raw.roleRu : raw.roleKz || raw.roleRu,
    experience: ru ? raw.experienceRu : raw.experienceKz || raw.experienceRu,
    lead: ru ? raw.leadRu : raw.leadKz || raw.leadRu,
    bio: ru ? raw.bioRu : raw.bioKz || raw.bioRu,
    tags: ru ? raw.tagsRu || [] : raw.tagsKz || raw.tagsRu || [],
    temporaryActive: Boolean(raw.temporaryActive),
    temporaryUntil: raw.temporaryUntil || null,
    stats: (raw.stats || []).map((s) => ({
      value: ru ? s.valueRu : s.valueKz || s.valueRu,
      label: ru ? s.labelRu : s.labelKz || s.labelRu,
    })),
    specialties: (raw.specialties || []).map((s) => ({
      title: ru ? s.titleRu : s.titleKz || s.titleRu,
      text: ru ? s.textRu : s.textKz || s.textRu,
    })),
  };
}

export function doctorsForCity(doctors, cityId) {
  if (!cityId) return doctors;
  return doctors.filter((d) => (d.cities || []).includes(cityId));
}

export async function loadDoctors(force = false) {
  const now = Date.now();
  if (!force && cache && now - cacheTs < TTL) return cache;
  try {
    const res = await fetch(`${import.meta.env.BASE_URL || "/"}data/doctors-ui.json`, { cache: "no-store" });
    if (!res.ok) throw new Error("doctors_fetch_failed");
    const data = await res.json();
    cache = Array.isArray(data) ? data : [];
    cacheTs = now;
    return cache;
  } catch {
    cache = [];
    cacheTs = now;
    return cache;
  }
}

export async function getDoctorById(id, lang = "ru") {
  const doctors = await loadDoctors();
  const raw = doctors.find((d) => d.id === id);
  return localizeDoctor(raw, lang);
}
