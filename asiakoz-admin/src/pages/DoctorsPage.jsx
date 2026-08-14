import { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import { CITY_LABELS, deleteDoctor, listDoctors, saveDoctor, toggleDoctorActive } from "../lib/doctors";

const emptyForm = {
  id: "",
  active: true,
  sortOrder: "",
  cities: "almaty",
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

  function editDoctor(doctor) {
    setForm({
      id: doctor.id,
      active: doctor.active !== false,
      sortOrder: String(doctor.sortOrder ?? ""),
      cities: (doctor.cities || []).join(", "),
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
            Белсенді дәрігерлер басты бетте көрінеді. Белсенді емес — сайтта жасырылады.
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
              Қала(лар)
              <input
                value={form.cities}
                onChange={(e) => setForm({ ...form, cities: e.target.value })}
                placeholder="almaty, aqtau"
                style={inputStyle}
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
              Филиал (RU)
              <input value={form.branchRu} onChange={(e) => setForm({ ...form, branchRu: e.target.value })} placeholder="Алматы · Лазерный хирург" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Филиал (KZ)
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
              Бio (RU)
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
            <input
              type="checkbox"
              checked={form.fromTurkey}
              onChange={(e) => setForm({ ...form, fromTurkey: e.target.checked })}
            />
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
                <td>{(doctor.cities || []).map(cityLabel).join(", ") || "—"}</td>
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
