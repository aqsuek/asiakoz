import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import { isAuthed, logout } from "./lib/auth";
import NewsPage from "./pages/NewsPage";
import StatsPage from "./pages/StatsPage";

function Protected({ children }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthed(isAuthed());
    setReady(true);
  }, []);

  if (!ready) return <main style={{ padding: 40 }}>Жүктелуде…</main>;
  if (!authed) return <LoginScreen onSuccess={() => { setAuthed(true); navigate("/"); }} />;

  const onLogout = () => {
    logout();
    setAuthed(false);
  };

  return children(onLogout);
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Protected>{(onLogout) => <StatsPage onLogout={onLogout} />}</Protected>
        }
      />
      <Route
        path="/news"
        element={
          <Protected>{(onLogout) => <NewsPage onLogout={onLogout} />}</Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
