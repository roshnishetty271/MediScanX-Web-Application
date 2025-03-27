import Products from "../components/Home/Products/products";
import Navbar from "../components/Home/NavBar/Navbar";
import HeroPage from "../components/Home/Hero/Hero";
import CurvedBoxContainer from "../components/Home/corousal/CurvedBox";
import DoctorProfileSection from "../components/Home//corousal/DoctorProfileSection";
import Stats from "../components/Home/Stats/stats";
import Footer from "../components/Home/Footer/footer";

const home = () => {
  return (
    <>
      <Navbar />
      <HeroPage />
      <Products />
      <CurvedBoxContainer />
      <Stats />
      <DoctorProfileSection />
      <Footer />

      {/* Add the rest of your application content here */}
    </>
  );
};

export default home;
