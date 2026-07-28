import { useEffect, useState } from "react";
import { LanguageProvider } from "./i18n/LanguageContext";
import { CityProvider } from "./context/CityContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileSticky from "./components/MobileSticky";
import HomePage from "./pages/HomePage";
import DoctorPage from "./pages/DoctorPage";
import { parseRoute } from "./lib/routes";
import { useLang } from "./i18n/LanguageContext";

function Router() {
  const { t } = useLang();
  const [route, setRoute] = useState(() => parseRoute());

  useEffect(() => {
    const sync = () => setRoute(parseRoute());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    if (route.name === "home") {
      document.title = t.seoTitle;
    }
  }, [route, t.seoTitle]);

  return (
    <div id="top" className="min-h-screen bg-surface-warm">
      <Header />
      <main>
        {route.name === "doctor" ? (
          <DoctorPage doctorId={route.id} />
        ) : (
          <HomePage />
        )}
      </main>
      <Footer />
      <MobileSticky />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CityProvider>
        <Router />
      </CityProvider>
    </LanguageProvider>
  );
}
