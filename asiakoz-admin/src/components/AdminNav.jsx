import { Link, useLocation } from "react-router-dom";

const tabs = [
  { href: "/", label: "Статистика" },
  { href: "/news", label: "Жаңалықтар / Vlog" },
  { href: "/doctors", label: "Дәрігерлер" },
];

export default function AdminNav({ onLogout }) {
  const location = useLocation();

  return (
    <header style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <div>
        <p style={{ margin: 0, color: "#00A9C1", fontWeight: 700, fontSize: 13 }}>ASIAKOZ</p>
        <h1 style={{ margin: "4px 0 0", fontSize: 28 }}>Админ панель</h1>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            to={tab.href}
            style={{
              borderRadius: 999,
              padding: "8px 14px",
              fontWeight: 700,
              background: location.pathname === tab.href ? "#00A9C1" : "#EDFAFC",
              color: location.pathname === tab.href ? "#fff" : "#0B3A4A",
            }}
          >
            {tab.label}
          </Link>
        ))}
        <button type="button" onClick={onLogout} style={btnGhost}>
          Шығу
        </button>
      </div>
    </header>
  );
}

const btnGhost = {
  border: "1px solid rgba(12,18,34,0.12)",
  background: "#fff",
  borderRadius: 999,
  padding: "8px 12px",
  cursor: "pointer",
};
