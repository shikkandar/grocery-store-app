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
  const [jwt, setJwt] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    setJwt(jwt);
    
    if (jwt) {
      const redirectPath = localStorage.getItem("redirectPath");
      router.replace(redirectPath || "/");
      localStorage.removeItem("redirectPath");
    }
  }, [router]);

  if (jwt) {
    return null; // If the user is authenticated, render nothing here.
  }

  return children; // If not authenticated, render the children (login form).
};