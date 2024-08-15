// pages/sign-in.js
"use client";
import { UnAuthUser } from "@/app/_ProtectRoute/AuthUser";
import { signIn } from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Component = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loader, setLoader] = useState(false);

  const router = useRouter();
  const onSignIn = () => {
    setLoader(true);
    signIn(email, password).then(
      (res) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("jwt", res.data.jwt);
        }
        toast.success("Login Successfully");
        router.push("/");
        setLoader(false);
      },
      (err) => {
        toast.error(err?.response?.data?.error?.message);
        setLoader(false);
      }
    );
  };
  return (
    <div className="flex items-baseline justify-center my-20 ">
      {/* ... rest of the component */}
    </div>
  );
};

const SignIn = () => {
  return (
    <UnAuthUser>
      <Component />
    </UnAuthUser>
  );
};

export default SignIn;