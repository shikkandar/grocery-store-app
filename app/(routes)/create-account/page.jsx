"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { registerUser } from "@/app/_utils/GlobalApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import { UnAuthUser } from "@/app/_ProtectRoute/AuthUser";


const Component = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="flex items-baseline justify-center my-20">
      <div className="flex flex-col items-center justify-center p-10 bg-slate-100 border-gray-200">
        <div className="flex gap-2 items-center">
          <Image src={"/logo.png"} alt="logo" width={50} height={50} />
          <div>
            <h2 className="text-2xl font-bold text-red-500">Grocery</h2>
            <h2 className="text-2xl font-bold text-green-600">Store</h2>
          </div>
        </div>
        <h2 className="font-bold text-3xl">Create Account</h2>
        <h2 className="text-gray-500">
          Enter your Email and password to create an account
        </h2>
        <div className="w-full flex flex-col gap-5 mt-7">
          <Input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
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
            disabled={!(username && email && password)}
            onClick={onCreateAccount}
          >
            {loader ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              "Create an account"
            )}
          </Button>
          <p>
            Already have an account{" "}
            <Link className="text-blue-500" href={"/sign-in"}>
              sign in
            </Link>
          </p>
        </div>
      </div>
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
