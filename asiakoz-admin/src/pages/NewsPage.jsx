import { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import { deletePost, listPosts, savePost } from "../lib/posts";

const emptyForm = {
  id: "",
  type: "news",
  status: "draft",
  slug: "",
  cover: "",
  videoUrl: "",
  titleRu: "",
  titleKz: "",
  excerptRu: "",
  excerptKz: "",
  bodyRu: "",
  bodyKz: "",
};

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("ru-KZ", { hour12: false });
  } catch {
    return String(value);
  }
}

export default function NewsPage({ onLogout }) {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  async function loadPosts() {
    setPosts(await listPosts());
  }

  useEffect(() => {
    loadPosts().catch(() => setError("Жазбалар жүктелмеді"));
  }, []);

  function editPost(post) {
    setForm({
      id: post.id,
      type: post.type || "news",
      status: post.status || "draft",
      slug: post.slug || "",
      cover: post.cover || "",
      videoUrl: post.videoUrl || "",
      titleRu: post.titleRu || "",
      titleKz: post.titleKz || "",
      excerptRu: post.excerptRu || "",
      excerptKz: post.excerptKz || "",
      bodyRu: post.bodyRu || "",
      bodyKz: post.bodyKz || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaveMsg("");
    try {
      const post = await savePost(form);
      setSaveMsg("GitHub-қа сақталды. Сайт 1–2 минутта жаңарады.");
      await loadPosts();
      editPost(post);
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
    if (!window.confirm("Жазбаны жою керек пе?")) return;
    await deletePost(id);
    if (form.id === id) setForm(emptyForm);
    await loadPosts();
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 64px" }}>
      <AdminNav onLogout={onLogout} />

      <section style={cardStyle}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>{form.id ? "Жазбаны өңдеу" : "Жаңа жазба"}</h2>
          <p style={{ margin: "6px 0 0", color: "#4A5568", fontSize: 14 }}>
            «Сақтау» — GitHub repo-ға commit. Жарияланған жазбалар `/news/` бетінде пайда болады.
          </p>
        </div>
        {saveMsg ? <p style={{ color: "#0B3A4A", fontSize: 13, marginTop: 10 }}>{saveMsg}</p> : null}

        <form onSubmit={save} style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            <label style={labelStyle}>
              Түрі
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                <option value="news">Жаңалық</option>
                <option value="vlog">Vlog</option>
              </select>
            </label>
            <label style={labelStyle}>
              Статус
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                <option value="draft">Жоба</option>
                <option value="published">Жарияланған</option>
              </select>
            </label>
            <label style={labelStyle}>
              Slug (URL)
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="shymkent-ashyldy" style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={labelStyle}>
              Тақырып (RU) *
              <input required value={form.titleRu} onChange={(e) => setForm({ ...form, titleRu: e.target.value })} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Тақырып (KZ)
              <input value={form.titleKz} onChange={(e) => setForm({ ...form, titleKz: e.target.value })} style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={labelStyle}>
              Қысқаша (RU)
              <textarea value={form.excerptRu} onChange={(e) => setForm({ ...form, excerptRu: e.target.value })} rows={3} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Қысқаша (KZ)
              <textarea value={form.excerptKz} onChange={(e) => setForm({ ...form, excerptKz: e.target.value })} rows={3} style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={labelStyle}>
              Мәтін (RU)
              <textarea value={form.bodyRu} onChange={(e) => setForm({ ...form, bodyRu: e.target.value })} rows={8} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Мәтін (KZ)
              <textarea value={form.bodyKz} onChange={(e) => setForm({ ...form, bodyKz: e.target.value })} rows={8} style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={labelStyle}>
              Мұқаба URL
              <input value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} placeholder="/images/shymkent-branch.png" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              YouTube (vlog)
              <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." style={inputStyle} />
            </label>
          </div>

          {error ? <p style={{ color: "#b42318", fontSize: 13 }}>{error}</p> : null}
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={saving} style={btnPrimary}>
              {saving ? "Сақталуда…" : "Сақтау"}
            </button>
            {form.id ? (
              <button type="button" onClick={() => setForm(emptyForm)} style={btnGhost}>
                Жаңа жазба
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section style={{ ...cardStyle, marginTop: 16 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Барлық жазбалар ({posts.length})</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#4A5568" }}>
              <th style={{ padding: "8px 0" }}>Тақырып</th>
              <th>Түрі</th>
              <th>Статус</th>
              <th>Жарияланды</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} style={{ borderTop: "1px solid rgba(12,18,34,0.06)" }}>
                <td style={{ padding: "10px 0" }}>
                  <strong>{post.titleRu || post.titleKz}</strong>
                  <div style={{ fontSize: 12, color: "#7A8494" }}>/news/{post.slug}/</div>
                </td>
                <td>{post.type === "vlog" ? "Vlog" : "Жаңалық"}</td>
                <td>{post.status === "published" ? "Жарияланған" : "Жоба"}</td>
                <td style={{ whiteSpace: "nowrap" }}>{formatDate(post.publishedAt)}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button type="button" onClick={() => editPost(post)} style={btnGhost}>
                    Өңдеу
                  </button>{" "}
                  <button type="button" onClick={() => remove(post.id)} style={{ ...btnGhost, color: "#b42318" }}>
                    Жою
                  </button>
                </td>
              </tr>
            ))}
            {!posts.length ? (
              <tr>
                <td colSpan={5} style={{ padding: "12px 0", color: "#7A8494" }}>
                  Әлі жазба жоқ.
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
