import { useState } from "react";
import { login } from "../lib/auth";

export default function LoginScreen({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          if (!login(username, password)) {
            setError("Логин немесе пароль қате");
            return;
          }
          onSuccess();
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
          Логин мен парольмен кіріңіз
        </p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Логин"
          autoComplete="username"
          style={inputStyle}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          autoComplete="current-password"
          style={{ ...inputStyle, marginTop: 12 }}
        />
        {error ? <p style={{ color: "#b42318", fontSize: 13 }}>{error}</p> : null}
        <button type="submit" style={{ ...btnPrimary, marginTop: 12 }}>
          Кіру
        </button>
      </form>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid rgba(12,18,34,0.12)",
  borderRadius: 12,
  padding: "12px 14px",
};
const btnPrimary = {
  width: "100%",
  background: "#00A9C1",
  color: "#fff",
  border: 0,
  borderRadius: 12,
  padding: "12px 14px",
  fontWeight: 700,
  cursor: "pointer",
};
