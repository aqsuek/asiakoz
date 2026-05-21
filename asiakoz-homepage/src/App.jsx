import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustStats from "./components/TrustStats";
import Services from "./components/Services";
import Doctors from "./components/Doctors";
import WhyChoose from "./components/WhyChoose";
import Process from "./components/Process";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import FixedWhatsApp from "./components/FixedWhatsApp";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustStats />
        <Services />
        <Doctors />
        <WhyChoose />
        <Process />
        <Reviews />
      </main>
      <Footer />
      <FixedWhatsApp />
    </>
  );
}
