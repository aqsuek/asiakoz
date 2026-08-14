import { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import {
  CITY_LABELS,
  CITY_OPTIONS,
  deleteDoctor,
  isTemporaryActive,
  listDoctors,
  resolveDoctorForPublish,
  saveDoctor,
  toggleDoctorActive,
} from "../lib/doctors";

const emptyTemp = {
  enabled: false,
  city: "shymkent",
  from: "",
  until: "",
  branchRu: "",
  branchKz: "",
  leadRu: "",
  leadKz: "",
};

const emptyForm = {
  id: "",
  active: true,
  sortOrder: "",
  cities: ["almaty"],
  temporaryAssignment: emptyTemp,
  profileUrl: "",
  image: "",
  fromTurkey: false,
  nameRu: "",
  nameKz: "",
  branchRu: "",
  branchKz: "",
  roleRu: "",
  roleKz: "",
  experienceRu: "",
  experienceKz: "",
  leadRu: "",
  leadKz: "",
  bioRu: "",
  bioKz: "",
  tagsRu: "",
  tagsKz: "",
};

function cityLabel(id) {
  return CITY_LABELS[id]?.ru || id;
}

function formatTempRange(temp) {
  if (!temp?.from && !temp?.until) return "";
  if (temp.from && temp.until) return `${temp.from} — ${temp.until}`;
  if (temp.from) return `бастап ${temp.from}`;
  return `дейін ${temp.until}`;
}

function doctorCitiesLabel(doctor) {
  const resolved = resolveDoctorForPublish(doctor);
  const base = (doctor.cities || []).map(cityLabel).join(", ") || "—";
  if (isTemporaryActive(doctor.temporaryAssignment)) {
    return `${base} → ${cityLabel(doctor.temporaryAssignment.city)} (${formatTempRange(doctor.temporaryAssignment)})`;
  }
  return resolved.cities.map(cityLabel).join(", ") || "—";
}

export default function DoctorsPage({ onLogout }) {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  async function load() {
    setDoctors(await listDoctors());
  }

  useEffect(() => {
    load().catch(() => setError("Дәрігерлер жүктелмеді"));
  }, []);

  function toggleCity(cityId) {
    setForm((prev) => {
      const has = prev.cities.includes(cityId);
      const cities = has ? prev.cities.filter((id) => id !== cityId) : [...prev.cities, cityId];
      return { ...prev, cities: cities.length ? cities : [cityId] };
    });
  }

  function editDoctor(doctor) {
    const temp = doctor.temporaryAssignment;
    setForm({
      id: doctor.id,
      active: doctor.active !== false,
      sortOrder: String(doctor.sortOrder ?? ""),
      cities: doctor.cities?.length ? [...doctor.cities] : ["almaty"],
      temporaryAssignment: temp
        ? {
            enabled: true,
            city: temp.city || "shymkent",
            from: temp.from || "",
            until: temp.until || "",
            branchRu: temp.branchRu || "",
            branchKz: temp.branchKz || "",
            leadRu: temp.leadRu || "",
            leadKz: temp.leadKz || "",
          }
        : { ...emptyTemp },
      profileUrl: doctor.profileUrl || "",
      image: doctor.image || "",
      fromTurkey: Boolean(doctor.fromTurkey),
      nameRu: doctor.nameRu || "",
      nameKz: doctor.nameKz || "",
      branchRu: doctor.branchRu || "",
      branchKz: doctor.branchKz || "",
      roleRu: doctor.roleRu || "",
      roleKz: doctor.roleKz || "",
      experienceRu: doctor.experienceRu || "",
      experienceKz: doctor.experienceKz || "",
      leadRu: doctor.leadRu || "",
      leadKz: doctor.leadKz || "",
      bioRu: doctor.bioRu || "",
      bioKz: doctor.bioKz || "",
      tagsRu: (doctor.tagsRu || []).join(", "),
      tagsKz: (doctor.tagsKz || []).join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaveMsg("");
    try {
      const doctor = await saveDoctor({
        ...form,
        active: form.active,
        sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
        temporaryAssignment: form.temporaryAssignment?.enabled ? form.temporaryAssignment : null,
        stats: doctors.find((d) => d.id === form.id)?.stats || [],
        specialties: doctors.find((d) => d.id === form.id)?.specialties || [],
      });
      setSaveMsg("GitHub-қа сақталды. Сайт 1–2 минутта жаңарады.");
      await load();
      editDoctor(doctor);
    } catch (err) {
      if (err.message === "github_token_missing") {
        setError("Сақтау конфигурациясы жоқ. Админ build-ке GitHub token қосу керек.");
      } else {
        setError(err.message || "Сақтау сәтсіз");
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Дәрігерді жою керек пе?")) return;
    await deleteDoctor(id);
    if (form.id === id) setForm(emptyForm);
    await load();
  }

  async function toggleActive(doctor) {
    setError("");
    try {
      await toggleDoctorActive(doctor.id, !doctor.active);
      await load();
      setSaveMsg(`${doctor.nameRu || doctor.nameKz} — ${doctor.active ? "деактивацияланды" : "белсенді"}`);
    } catch (err) {
      setError(err.message || "Статус өзгертілмеді");
    }
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 64px" }}>
      <AdminNav onLogout={onLogout} />

      <section style={cardStyle}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>{form.id ? "Дәрігерді өңдеу" : "Жаңа дәрігер"}</h2>
          <p style={{ margin: "6px 0 0", color: "#4A5568", fontSize: 14 }}>
            Негізгі қаланы таңдаңыз. Уақытша филиал — мысалы, дәрігер 1 ай Шымкентте болса.
          </p>
        </div>
        {saveMsg ? <p style={{ color: "#0B3A4A", fontSize: 13, marginTop: 10 }}>{saveMsg}</p> : null}

        <form onSubmit={save} style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            <label style={labelStyle}>
              Статус
              <select
                value={form.active ? "active" : "inactive"}
                onChange={(e) => setForm({ ...form, active: e.target.value === "active" })}
                style={inputStyle}
              >
                <option value="active">Белсенді</option>
                <option value="inactive">Белсенді емес</option>
              </select>
            </label>
            <label style={labelStyle}>
              ID (URL)
              <input
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                placeholder="mehmet-esat-teker"
                style={inputStyle}
                disabled={Boolean(form.id && doctors.some((d) => d.id === form.id))}
              />
            </label>
            <label style={labelStyle}>
              Реті
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                placeholder="1"
                style={inputStyle}
              />
            </label>
          </div>

          <div style={boxStyle}>
            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#0B3A4A" }}>Негізгі қалалар</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CITY_OPTIONS.map((cityId) => {
                const active = form.cities.includes(cityId);
                return (
                  <button
                    key={cityId}
                    type="button"
                    onClick={() => toggleCity(cityId)}
                    style={{
                      ...btnGhost,
                      fontWeight: 700,
                      background: active ? "#00A9C1" : "#fff",
                      color: active ? "#fff" : "#0B3A4A",
                      borderColor: active ? "#00A9C1" : "rgba(12,18,34,0.12)",
                    }}
                  >
                    {cityLabel(cityId)}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={boxStyle}>
            <label style={{ ...labelStyle, flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={form.temporaryAssignment.enabled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    temporaryAssignment: { ...form.temporaryAssignment, enabled: e.target.checked },
                  })
                }
              />
              Уақытша басқа филиалда (мысалы, 1 ай Шымкентте)
            </label>

            {form.temporaryAssignment.enabled ? (
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                  <label style={labelStyle}>
                    Қала
                    <select
                      value={form.temporaryAssignment.city}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          temporaryAssignment: { ...form.temporaryAssignment, city: e.target.value },
                        })
                      }
                      style={inputStyle}
                    >
                      {CITY_OPTIONS.map((cityId) => (
                        <option key={cityId} value={cityId}>
                          {cityLabel(cityId)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label style={labelStyle}>
                    Басталу
                    <input
                      type="date"
                      value={form.temporaryAssignment.from}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          temporaryAssignment: { ...form.temporaryAssignment, from: e.target.value },
                        })
                      }
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    Аяқталу
                    <input
                      type="date"
                      value={form.temporaryAssignment.until}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          temporaryAssignment: { ...form.temporaryAssignment, until: e.target.value },
                        })
                      }
                      style={inputStyle}
                    />
                  </label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <label style={labelStyle}>
                    Филиал (RU) — сайтта көрінеді
                    <input
                      value={form.temporaryAssignment.branchRu}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          temporaryAssignment: { ...form.temporaryAssignment, branchRu: e.target.value },
                        })
                      }
                      placeholder="Шымкент · Лазерный хирург"
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    Филиал (KZ)
                    <input
                      value={form.temporaryAssignment.branchKz}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          temporaryAssignment: { ...form.temporaryAssignment, branchKz: e.target.value },
                        })
                      }
                      placeholder="Шымкент · Лазерлік хирург"
                      style={inputStyle}
                    />
                  </label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <label style={labelStyle}>
                    Қысқаша (RU) — уақытша
                    <textarea
                      value={form.temporaryAssignment.leadRu}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          temporaryAssignment: { ...form.temporaryAssignment, leadRu: e.target.value },
                        })
                      }
                      rows={2}
                      placeholder="Приём в Шымкенте до сентября."
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    Қысқаша (KZ) — уақытша
                    <textarea
                      value={form.temporaryAssignment.leadKz}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          temporaryAssignment: { ...form.temporaryAssignment, leadKz: e.target.value },
                        })
                      }
                      rows={2}
                      placeholder="Қыркүйекке дейін Шымкентте қабылдайды."
                      style={inputStyle}
                    />
                  </label>
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={labelStyle}>
              Аты (RU) *
              <input required value={form.nameRu} onChange={(e) => setForm({ ...form, nameRu: e.target.value })} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Аты (KZ)
              <input value={form.nameKz} onChange={(e) => setForm({ ...form, nameKz: e.target.value })} style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={labelStyle}>
              Филиал (RU) — негізгі
              <input value={form.branchRu} onChange={(e) => setForm({ ...form, branchRu: e.target.value })} placeholder="Алматы · Лазерный хирург" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Филиал (KZ) — негізгі
              <input value={form.branchKz} onChange={(e) => setForm({ ...form, branchKz: e.target.value })} placeholder="Алматы · Лазерлік хирург" style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={labelStyle}>
              Лауазым (RU)
              <input value={form.roleRu} onChange={(e) => setForm({ ...form, roleRu: e.target.value })} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Лауазым (KZ)
              <input value={form.roleKz} onChange={(e) => setForm({ ...form, roleKz: e.target.value })} style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={labelStyle}>
              Тәжірибе (RU)
              <input value={form.experienceRu} onChange={(e) => setForm({ ...form, experienceRu: e.target.value })} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Тәжірибе (KZ)
              <input value={form.experienceKz} onChange={(e) => setForm({ ...form, experienceKz: e.target.value })} style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={labelStyle}>
              Қысқаша (RU)
              <textarea value={form.leadRu} onChange={(e) => setForm({ ...form, leadRu: e.target.value })} rows={3} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Қысқаша (KZ)
              <textarea value={form.leadKz} onChange={(e) => setForm({ ...form, leadKz: e.target.value })} rows={3} style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={labelStyle}>
              Bio (RU)
              <textarea value={form.bioRu} onChange={(e) => setForm({ ...form, bioRu: e.target.value })} rows={3} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Bio (KZ)
              <textarea value={form.bioKz} onChange={(e) => setForm({ ...form, bioKz: e.target.value })} rows={3} style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={labelStyle}>
              Фото URL
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="images/doctors/aliya.png" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Профиль URL
              <input value={form.profileUrl} onChange={(e) => setForm({ ...form, profileUrl: e.target.value })} placeholder="/almaty/doctor/aliya/" style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={labelStyle}>
              Тегтер (RU)
              <input value={form.tagsRu} onChange={(e) => setForm({ ...form, tagsRu: e.target.value })} placeholder="Лазер, Катаракта" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Тегтер (KZ)
              <input value={form.tagsKz} onChange={(e) => setForm({ ...form, tagsKz: e.target.value })} placeholder="Лазер, Катаракта" style={inputStyle} />
            </label>
          </div>

          <label style={{ ...labelStyle, flexDirection: "row", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={form.fromTurkey} onChange={(e) => setForm({ ...form, fromTurkey: e.target.checked })} />
            Түркиядан маман
          </label>

          {error ? <p style={{ color: "#b42318", fontSize: 13 }}>{error}</p> : null}
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={saving} style={btnPrimary}>
              {saving ? "Сақталуда…" : "Сақтау"}
            </button>
            {form.id ? (
              <button type="button" onClick={() => setForm(emptyForm)} style={btnGhost}>
                Жаңа дәрігер
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section style={{ ...cardStyle, marginTop: 16 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Барлық дәрігерлер ({doctors.length})</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#4A5568" }}>
              <th style={{ padding: "8px 0" }}>Аты</th>
              <th>Қала</th>
              <th>Статус</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id} style={{ borderTop: "1px solid rgba(12,18,34,0.06)" }}>
                <td style={{ padding: "10px 0" }}>
                  <strong>{doctor.nameRu || doctor.nameKz}</strong>
                  <div style={{ fontSize: 12, color: "#7A8494" }}>{doctor.profileUrl || `/doctor/${doctor.id}/`}</div>
                </td>
                <td>
                  {doctorCitiesLabel(doctor)}
                  {isTemporaryActive(doctor.temporaryAssignment) ? (
                    <div style={{ fontSize: 11, color: "#00A9C1", fontWeight: 700, marginTop: 4 }}>Уақытша филиал</div>
                  ) : null}
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => toggleActive(doctor)}
                    style={{
                      ...btnGhost,
                      color: doctor.active !== false ? "#0B3A4A" : "#7A8494",
                      fontWeight: 700,
                      background: doctor.active !== false ? "#EDFAFC" : "#fff",
                    }}
                  >
                    {doctor.active !== false ? "Белсенді" : "Белсенді емес"}
                  </button>
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button type="button" onClick={() => editDoctor(doctor)} style={btnGhost}>
                    Өңдеу
                  </button>{" "}
                  <button type="button" onClick={() => remove(doctor.id)} style={{ ...btnGhost, color: "#b42318" }}>
                    Жою
                  </button>
                </td>
              </tr>
            ))}
            {!doctors.length ? (
              <tr>
                <td colSpan={4} style={{ padding: "12px 0", color: "#7A8494" }}>
                  Әлі дәрігер жоқ.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </main>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(12,18,34,0.06)",
  borderRadius: 16,
  padding: 18,
};
const boxStyle = {
  border: "1px solid rgba(12,18,34,0.08)",
  borderRadius: 14,
  padding: 14,
  background: "#FAFCFD",
};
const labelStyle = { display: "grid", gap: 6, fontSize: 13, fontWeight: 600, color: "#4A5568" };
const inputStyle = {
  width: "100%",
  border: "1px solid rgba(12,18,34,0.12)",
  borderRadius: 12,
  padding: "10px 12px",
  resize: "vertical",
};
const btnPrimary = {
  background: "#00A9C1",
  color: "#fff",
  border: 0,
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
  cursor: "pointer",
};
const btnGhost = {
  border: "1px solid rgba(12,18,34,0.12)",
  background: "#fff",
  borderRadius: 12,
  padding: "8px 12px",
  cursor: "pointer",
};
