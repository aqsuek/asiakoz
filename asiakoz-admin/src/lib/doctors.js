import { getGithubToken } from "./auth";
import { readPublicJson, readRepoJson, writeRepoJson } from "./github";

const ADMIN_FILE = "data/doctors-admin.json";
const PUBLIC_SEO_FILE = "data/doctors.json";
const PUBLIC_UI_FILE = "data/doctors-ui.json";

const CITY_LABELS = {
  almaty: { ru: "Алматы", kz: "Алматы" },
  aqtau: { ru: "Актау", kz: "Ақтау" },
  shymkent: { ru: "Шымкент", kz: "Шымкент" },
};

function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseList(value) {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function normalizeDoctor(input = {}, existing, allDoctors = []) {
  const now = new Date().toISOString();
  const nameRu = String(input.nameRu || existing?.nameRu || "").trim();
  const nameKz = String(input.nameKz || existing?.nameKz || nameRu).trim();
  const baseId = slugify(input.id || existing?.id || nameRu || nameKz || "doctor");
  let id = baseId || `doctor-${Date.now()}`;
  let n = 1;
  while (allDoctors.some((d) => d.id === id && d.id !== existing?.id)) {
    id = `${baseId}-${n}`;
    n += 1;
  }

  const cities = parseList(input.cities ?? existing?.cities ?? []);
  const active = input.active === false || input.active === "false" ? false : true;

  return {
    id,
    active,
    sortOrder: Number(input.sortOrder ?? existing?.sortOrder ?? allDoctors.length + 1) || 0,
    cities,
    profileUrl: String(input.profileUrl || existing?.profileUrl || `/doctor/${id}/`).trim(),
    image: String(input.image || existing?.image || "").trim(),
    fromTurkey: Boolean(input.fromTurkey ?? existing?.fromTurkey),
    nameRu,
    nameKz,
    branchRu: String(input.branchRu || existing?.branchRu || "").trim(),
    branchKz: String(input.branchKz || existing?.branchKz || "").trim(),
    roleRu: String(input.roleRu || existing?.roleRu || "").trim(),
    roleKz: String(input.roleKz || existing?.roleKz || "").trim(),
    experienceRu: String(input.experienceRu || existing?.experienceRu || "").trim(),
    experienceKz: String(input.experienceKz || existing?.experienceKz || "").trim(),
    leadRu: String(input.leadRu || existing?.leadRu || "").trim(),
    leadKz: String(input.leadKz || existing?.leadKz || "").trim(),
    bioRu: String(input.bioRu || existing?.bioRu || "").trim(),
    bioKz: String(input.bioKz || existing?.bioKz || "").trim(),
    tagsRu: parseList(input.tagsRu ?? existing?.tagsRu ?? []),
    tagsKz: parseList(input.tagsKz ?? existing?.tagsKz ?? []),
    stats: Array.isArray(input.stats) ? input.stats : existing?.stats || [],
    specialties: Array.isArray(input.specialties) ? input.specialties : existing?.specialties || [],
    updatedAt: now,
    createdAt: existing?.createdAt || now,
  };
}

function seoDoctor(d) {
  const slug = `doctor-${d.id}`;
  return {
    id: d.id,
    slug,
    href: d.profileUrl || `/doctor-${d.id}/`,
    kkHref: `/kk${d.profileUrl || `/doctor-${d.id}/`}`,
    nameRu: d.nameRu,
    nameKz: d.nameKz,
    roleRu: d.roleRu,
    roleKz: d.roleKz,
    cities: d.cities,
    tagsRu: d.tagsRu,
    tagsKz: d.tagsKz,
    image: d.image.startsWith("/") ? d.image : `/${d.image}`,
    knowsAbout: d.tagsRu,
    ...(d.fromTurkey ? { fromTurkey: true } : {}),
  };
}

function uiDoctor(d) {
  const { active, createdAt, updatedAt, sortOrder, ...rest } = d;
  return rest;
}

function publishedPayload(store) {
  const active = store.doctors
    .filter((d) => d.active)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.nameRu.localeCompare(b.nameRu, "ru"));

  return {
    seo: {
      doctors: active.map(seoDoctor),
      redirects: store.redirects || {},
      notes: store.notes || [],
    },
    ui: active.map(uiDoctor),
  };
}

async function loadAdminStore() {
  const token = getGithubToken();
  try {
    const { data } = await readRepoJson(ADMIN_FILE, token);
    if (data?.doctors?.length) return data;
  } catch {
    /* fall back */
  }
  try {
    const publicUi = await readPublicJson(PUBLIC_UI_FILE);
    if (Array.isArray(publicUi) && publicUi.length) {
      return {
        doctors: publicUi.map((d) => ({ ...d, active: true })),
        redirects: {},
        notes: [],
      };
    }
  } catch {
    /* ignore */
  }
  const seo = await readPublicJson(PUBLIC_SEO_FILE);
  return {
    doctors: (seo.doctors || []).map((d) => ({
      id: d.id,
      active: true,
      sortOrder: 0,
      cities: d.cities || [],
      profileUrl: d.href || `/doctor-${d.id}/`,
      image: (d.image || "").replace(/^\//, ""),
      fromTurkey: Boolean(d.fromTurkey),
      nameRu: d.nameRu || "",
      nameKz: d.nameKz || d.nameRu || "",
      branchRu: "",
      branchKz: "",
      roleRu: d.roleRu || "",
      roleKz: d.roleKz || d.roleRu || "",
      experienceRu: "",
      experienceKz: "",
      leadRu: "",
      leadKz: "",
      bioRu: "",
      bioKz: "",
      tagsRu: d.tagsRu || [],
      tagsKz: d.tagsKz || d.tagsRu || [],
      stats: [],
      specialties: [],
    })),
    redirects: seo.redirects || {},
    notes: seo.notes || [],
  };
}

async function persistStore(store) {
  const token = getGithubToken();
  if (!token) throw new Error("github_token_missing");
  const { seo, ui } = publishedPayload(store);
  const [adminMeta, seoMeta, uiMeta] = await Promise.all([
    readRepoJson(ADMIN_FILE, token).catch(() => ({ sha: null })),
    readRepoJson(PUBLIC_SEO_FILE, token).catch(() => ({ sha: null })),
    readRepoJson(PUBLIC_UI_FILE, token).catch(() => ({ sha: null })),
  ]);
  await writeRepoJson(ADMIN_FILE, store, token, adminMeta.sha);
  await writeRepoJson(PUBLIC_SEO_FILE, seo, token, seoMeta.sha);
  await writeRepoJson(PUBLIC_UI_FILE, ui, token, uiMeta.sha);
  return store;
}

export async function listDoctors() {
  const store = await loadAdminStore();
  return store.doctors.sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.nameRu.localeCompare(b.nameRu, "ru"),
  );
}

export async function saveDoctor(input) {
  const store = await loadAdminStore();
  const existing = input.id ? store.doctors.find((d) => d.id === input.id) : null;
  const doctor = normalizeDoctor(input, existing, store.doctors);
  if (!doctor.nameRu && !doctor.nameKz) throw new Error("name_required");
  const nextDoctors = existing
    ? store.doctors.map((d) => (d.id === doctor.id ? doctor : d))
    : [...store.doctors, doctor];
  await persistStore({ ...store, doctors: nextDoctors });
  return doctor;
}

export async function deleteDoctor(id) {
  const store = await loadAdminStore();
  const nextDoctors = store.doctors.filter((d) => d.id !== id);
  if (nextDoctors.length === store.doctors.length) return false;
  await persistStore({ ...store, doctors: nextDoctors });
  return true;
}

export async function toggleDoctorActive(id, active) {
  const store = await loadAdminStore();
  const doctor = store.doctors.find((d) => d.id === id);
  if (!doctor) return null;
  const next = store.doctors.map((d) => (d.id === id ? { ...d, active: Boolean(active) } : d));
  await persistStore({ ...store, doctors: next });
  return next.find((d) => d.id === id);
}

export { CITY_LABELS };
