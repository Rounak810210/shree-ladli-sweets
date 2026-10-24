import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Categories from "../components/Categories";
import BestSellers from "../components/BestSellers";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Categories />
      <BestSellers />
      <Footer />
    </>
  );
}

export default Home;