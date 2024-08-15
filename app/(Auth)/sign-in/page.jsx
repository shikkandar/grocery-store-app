

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
       <div className="flex items-baseline justify-center my-20 ">
      <div className="flex flex-col items-center justify-center p-10 bg-slate-100 border-gray-200">
        <div className="flex gap-2 items-center">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={50}
            height={50}
          />
          <div>
            <h2 className="text-2xl font-bold text-red-500">Grocery</h2>
            <h2 className="text-2xl font-bold text-green-600">Store</h2>
          </div>
        </div>
        <h2 className="font-bold text-3xl">Sign in to account</h2>
        <h2 className="text-gray-500">
          Enter your Email and password to sign in account
        </h2>
        <div className="w-full flex flex-col gap-5 mt-7">
          <Input
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            disabled={!(email || password)}
            onClick={onSignIn}>
            {loader ? <LoaderIcon className="animate-spin" /> : "Sign In"}
          </Button>
          <p>
            Don't have an account ?
            <Link
              className="text-blue-500"
              href={"/create-account"}>
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
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
