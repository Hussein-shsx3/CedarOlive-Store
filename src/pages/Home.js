import React from "react";
import Header from "../components/header/header";
import Section1 from "../components/homePage/section1";
import Section2 from "../components/homePage/section2";
import Section3 from "../components/homePage/section3";
import Section4 from "../components/homePage/section4";
import Section5 from "../components/homePage/section5";
import Section6 from "../components/homePage/section6";
import Section7 from "../components/homePage/section7";
import Footer from "../components/footer/footer";
import ScrollToTop from "../components/scrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ScrollToTop />
      <Header />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Footer />
    </div>
  );
}

export default Home;
