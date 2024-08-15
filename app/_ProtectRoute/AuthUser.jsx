"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export const AuthUser = ({ children }) => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectPath", window.location.pathname);
        router.replace("/sign-in");
      }
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth) {
    return null; 
  }

  return <>{children}</>; 
};

export const UnAuthUser = ({ children }) => {
  const [jwt, setJwt] = useState();
  const [redirectPath, setRedirectPath] = useState();
  const router = useRouter();
  if (typeof window !== "undefined") {
    const jwt = localStorage.getItem("jwt");
    setJwt(jwt);
    const redirectPath = localStorage.getItem("redirectPath");
    setRedirectPath(redirectPath);
  }

  if (jwt) {
    if (redirectPath) {
      router.replace(redirectPath || "/");
      if (typeof window !== "undefined") {
        localStorage.removeItem("redirectPath");
      }
    }
  }
  if (!jwt) {
    return children;
  }
};
