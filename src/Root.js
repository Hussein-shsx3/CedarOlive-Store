import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/scroll/ScrollToTop";
import { useGetCurrentUser } from "./api/users/userApi";
import { useDispatch } from "react-redux";
import { setCurrentUser, checkExpiration } from "./redux/userSlice";
import { logout } from "./redux/authSlice";
import Cookies from "universal-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cookies = new Cookies();

const Root = () => {
  const dispatch = useDispatch();
  const token = cookies.get("token");
  const { data: currentUser, isSuccess, isError } = useGetCurrentUser();

  useEffect(() => {
    dispatch(checkExpiration());
    if (token && isSuccess && currentUser) {
      dispatch(setCurrentUser(currentUser));
    }
  }, [token, isSuccess, currentUser, dispatch]);

  useEffect(() => {
    if (token && isError) {
      dispatch(logout());
    }
  }, [token, isError, dispatch]);

  return (
    <>
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
        className="mt-16"
      />
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default Root;
