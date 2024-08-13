"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export const AuthUser = ({ children }) => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      localStorage.setItem("redirectPath", window.location.pathname);
      router.replace("/sign-in");
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth) {
    return null; // Render nothing (or a loader if desired) while checking authentication
  }

  return <>{children}</>; // Correctly return the children
};

export const UnAuthUser = ({ children }) => {
  const router = useRouter();
  const jwt = localStorage.getItem("jwt");

  const redirectPath = localStorage.getItem("redirectPath");

  if (jwt) {
    if (redirectPath) {
      router.replace(redirectPath || "/"); // Redirect to the original path
      localStorage.removeItem("redirectPath"); // Clear the stored path
    }
  }
  if (!jwt) {
    return children;
  }
};
