import { useEffect, useMemo, useState } from "react";
import AdminNav from "../components/AdminNav";

const EVENT_LABELS = {
  page_view: "Кіру",
  whatsapp_click: "WhatsApp",
  organic_whatsapp_click: "WhatsApp",
  phone_click: "Қоңырау",
  organic_phone_click: "Қоңырау",
  form_submit: "Форма",
  appointment_submit: "Форма",
  branch_select: "Қала",
};

function Stat({ label, value, hint }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(12,18,34,0.06)",
        borderRadius: 16,
        padding: 18,
      }}
    >
      <div style={{ fontSize: 12, color: "#4A5568", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6, color: "#0B3A4A" }}>{value}</div>
      {hint ? <div style={{ fontSize: 12, color: "#7A8494", marginTop: 4 }}>{hint}</div> : null}
    </div>
  );
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleString("ru-KZ", { hour12: false });
  } catch {
    return String(ts);
  }
}

export default function AdminHome() {
  const [authed, setAuthed] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [days, setDays] = useState(7);

  async function loadAuth() {
    const res = await fetch("/api/login");
    const data = await res.json();
    setAuthed(Boolean(data.ok));
  }

  async function loadStats(nextDays = days) {
    const res = await fetch(`/api/stats?days=${nextDays}`);
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    setStats(await res.json());
  }

  useEffect(() => {
    loadAuth();
  }, []);

  useEffect(() => {
    if (authed) loadStats(days);
  }, [authed, days]);

  const maxDay = useMemo(() => {
    if (!stats?.byDay?.length) return 1;
    return Math.max(1, ...stats.byDay.map((d) => d.views + d.whatsapp));
  }, [stats]);

  if (authed === null) {
    return <main style={{ padding: 40 }}>Жүктелуде…</main>;
  }

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            const res = await fetch("/api/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password }),
            });
            if (!res.ok) {
              setError("Құпиясөз қате");
              return;
            }
            setAuthed(true);
          }}
          style={{
            width: "min(380px, 100%)",
            background: "#fff",
            border: "1px solid rgba(12,18,34,0.06)",
            borderRadius: 20,
            padding: 28,
          }}
        >
          <p style={{ margin: 0, color: "#00A9C1", fontWeight: 700, fontSize: 13 }}>ASIAKOZ</p>
          <h1 style={{ margin: "8px 0 4px", fontSize: 24 }}>Админ панель</h1>
          <p style={{ margin: "0 0 18px", color: "#4A5568", fontSize: 14 }}>
            Кірулер, беттер және WhatsApp кликтері
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Құпиясөз"
            style={{
              width: "100%",
              border: "1px solid rgba(12,18,34,0.12)",
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 12,
            }}
          />
          {error ? <p style={{ color: "#b42318", fontSize: 13 }}>{error}</p> : null}
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#00A9C1",
              color: "#fff",
              border: 0,
              borderRadius: 12,
              padding: "12px 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Кіру
          </button>
        </form>
      </main>
    );
  }

  const today = stats?.today || {};
  const period = stats?.period || {};

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 64px" }}>
      <AdminNav
        onLogout={async () => {
          await fetch("/api/login", { method: "DELETE" });
          setAuthed(false);
        }}
      />
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16 }}>
        {[7, 30].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setDays(n)}
            style={{
              border: 0,
              borderRadius: 999,
              padding: "8px 12px",
              cursor: "pointer",
              background: days === n ? "#00A9C1" : "#EDFAFC",
              color: days === n ? "#fff" : "#0B3A4A",
              fontWeight: 700,
            }}
          >
            {n} күн
          </button>
        ))}
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 24 }}>
        <Stat label="Бүгін кірді" value={today.visitors ?? "—"} hint={`${today.pageViews || 0} бет көрінісі`} />
        <Stat label="WhatsApp бүгін" value={today.whatsapp ?? "—"} hint="Батпаны басу" />
        <Stat label={`${days} күнде кіру`} value={period.visitors ?? "—"} hint={`${period.pageViews || 0} бет`} />
        <Stat label="WhatsApp кезеңде" value={period.whatsapp ?? "—"} hint={`Қоңырау: ${period.phone || 0}`} />
      </section>

      <section
        style={{
          marginTop: 20,
          background: "#fff",
          border: "1px solid rgba(12,18,34,0.06)",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <h2 style={{ margin: "0 0 14px", fontSize: 16 }}>Күн бойынша</h2>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
          {(stats?.byDay || []).map((d) => (
            <div key={d.date} style={{ flex: 1, textAlign: "center" }}>
              <div
                title={`${d.date}: ${d.views} кіру, ${d.whatsapp} WhatsApp`}
                style={{
                  height: `${Math.round(((d.views + d.whatsapp) / maxDay) * 110)}px`,
                  background: "#00A9C1",
                  borderRadius: 8,
                  minHeight: 4,
                }}
              />
              <div style={{ fontSize: 10, color: "#7A8494", marginTop: 6 }}>{d.date.slice(5)}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, marginTop: 16 }}>
        <section
          style={{
            background: "#fff",
            border: "1px solid rgba(12,18,34,0.06)",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Қай бетке өтті</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#4A5568" }}>
                <th style={{ padding: "8px 0" }}>Бет</th>
                <th style={{ padding: "8px 0", width: 80 }}>Кіру</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.topPages || []).map((row) => (
                <tr key={row.path} style={{ borderTop: "1px solid rgba(12,18,34,0.06)" }}>
                  <td style={{ padding: "10px 0" }}>{row.path}</td>
                  <td style={{ padding: "10px 0", fontWeight: 700 }}>{row.views}</td>
                </tr>
              ))}
              {!stats?.topPages?.length ? (
                <tr>
                  <td colSpan={2} style={{ padding: "12px 0", color: "#7A8494" }}>
                    Әлі дерек жоқ. Сайтты ашып, беттерді аралаңыз.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>

        <section
          style={{
            background: "#fff",
            border: "1px solid rgba(12,18,34,0.06)",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Қалалар</h2>
          {(stats?.cities || []).map((c) => (
            <div key={c.city} style={{ padding: "10px 0", borderTop: "1px solid rgba(12,18,34,0.06)" }}>
              <strong>{c.city}</strong>
              <div style={{ fontSize: 13, color: "#4A5568", marginTop: 4 }}>
                {c.views} кіру · {c.whatsapp} WhatsApp · {c.phone} қоңырау
              </div>
            </div>
          ))}
          {!stats?.cities?.length ? <p style={{ color: "#7A8494" }}>Дерек жоқ</p> : null}
        </section>
      </div>

      <section
        style={{
          marginTop: 16,
          background: "#fff",
          border: "1px solid rgba(12,18,34,0.06)",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Соңғы әрекеттер</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#4A5568" }}>
              <th style={{ padding: "8px 0" }}>Уақыт</th>
              <th>Не істеді</th>
              <th>Бет</th>
              <th>Қала</th>
            </tr>
          </thead>
          <tbody>
            {(stats?.recent || [])
              .filter((e) => e.event !== "organic_whatsapp_click" && e.event !== "organic_phone_click")
              .slice(0, 40)
              .map((e) => (
                <tr key={e.id} style={{ borderTop: "1px solid rgba(12,18,34,0.06)" }}>
                  <td style={{ padding: "8px 8px 8px 0", whiteSpace: "nowrap" }}>{formatTime(e.ts)}</td>
                  <td>{EVENT_LABELS[e.event] || e.event}</td>
                  <td>{e.page_path}</td>
                  <td>{e.city || "—"}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: "#7A8494", marginTop: 12 }}>
          WhatsApp бағаны — сайттағы батырманы басу. Чатта хабарлама жазылғанын сайт көрмейді.
        </p>
      </section>
    </main>
  );
}
