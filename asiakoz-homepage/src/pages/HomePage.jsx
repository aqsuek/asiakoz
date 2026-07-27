import Hero from "../components/Hero";
import PromoBanner from "../components/PromoBanner";
import Advantages from "../components/Advantages";
import Services from "../components/Services";
import Doctors from "../components/Doctors";
import Reviews from "../components/Reviews";
import Booking from "../components/Booking";
import Contacts from "../components/Contacts";
import { IS_LASER } from "../lib/branch";

export default function HomePage() {
  return (
    <>
      {IS_LASER && <PromoBanner />}
      <Hero />
      <Advantages />
      <Services />
      <Doctors />
      <Reviews />
      <Booking />
      <Contacts />
    </>
  );
}
