import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/scroll/ScrollToTop";

const Root = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default Root;
