import React from "react";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Section1 from "../components/blogPage/section1";
import Section2 from "../components/blogPage/section2";
import ScrollToTop from "../components/scrollToTop";

const Blog = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <ScrollToTop />
      <Header />
      <Section1 />
      <Section2 />
      <Footer />
    </div>
  );
};

export default Blog;
