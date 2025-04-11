import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/scroll/ScrollToTop";
import { useGetCurrentUser } from "./api/users/userApi";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./redux/userSlice";
import { checkExpiration } from "./redux/userSlice";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Root = () => {
  const dispatch = useDispatch();
  const token = cookies.get("token");
  const { data: currentUser, isSuccess } = useGetCurrentUser();

  useEffect(() => {
    dispatch(checkExpiration());
    if (token && isSuccess && currentUser) {
      dispatch(setCurrentUser(currentUser));
    }
  }, [token, isSuccess, currentUser, dispatch]);

  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default Root;
