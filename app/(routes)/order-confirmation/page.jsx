"use client";

import { AuthUser } from "@/app/_ProtectRoute/AuthUser";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const Component = () => {
  return (
    <div>
      <div className="flex justify-center my-20">
        <div className="  flex flex-col justify-center p-20 rounded-md items-center gap-3 px-32">
          <CheckCircle className="h-24 w-24 text-primary" />
          <h2 className="font-medium text-3xl text-primary">Order Success</h2>
          <h2>Thank you so much for order</h2>
          <Link href={"my-order"}>
            <Button className="mt-8">Track your order</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
const OrderConfirmation = () => {
  return (
    <AuthUser>
      <Component />
    </AuthUser>
  );
};

export default OrderConfirmation;
