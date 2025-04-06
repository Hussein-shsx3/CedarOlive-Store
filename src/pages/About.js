import React from "react";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Section1 from "../components/aboutPage/section1";
import Section2 from "../components/aboutPage/section2";
import Section3 from "../components/aboutPage/section3";
import Section4 from "../components/aboutPage/section4";

const About = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Header />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Footer />
    </div>
  );
};

export default About;
