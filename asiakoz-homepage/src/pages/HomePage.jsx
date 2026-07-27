import Hero from "../components/Hero";
import PromoBanner from "../components/PromoBanner";
import LaserOfferBanner from "../components/LaserOfferBanner";
import QuickPaths from "../components/QuickPaths";
import Advantages from "../components/Advantages";
import Services from "../components/Services";
import Doctors from "../components/Doctors";
import Reviews from "../components/Reviews";
import Booking from "../components/Booking";
import Contacts from "../components/Contacts";
import { IS_ALMATY, IS_LASER } from "../lib/branch";

export default function HomePage() {
  return (
    <>
      {IS_LASER && <PromoBanner />}
      {IS_ALMATY && <LaserOfferBanner />}
      <Hero />
      {IS_ALMATY && <QuickPaths />}
      <Advantages />
      <Services />
      <Doctors />
      <Reviews />
      <Booking />
      <Contacts />
    </>
  );
}
