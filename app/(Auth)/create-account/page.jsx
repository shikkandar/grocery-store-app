// pages/create-account.js
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { registerUser } from "@/app/_utils/GlobalApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import { UnAuthUser } from "@/app/_ProtectRoute/AuthUser";

const Component = () => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loader, setLoader] = useState(false);

  const router = useRouter();
  const onCreateAccount = () => {
    setLoader(true);
    registerUser(username, email, password).then(
      (res) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("jwt", res.data.jwt);
        }
        toast.success("Account Created Successfully");
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

const CreateAccount = () => {
  return (
    <UnAuthUser>
      <Component />
    </UnAuthUser>
  );
};

export default CreateAccount;