"use client";

import { getMyOrder } from "@/app/_utils/GlobalApi";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import moment from "moment";
import MyOrderItem from "./_components/MyOrderItem";
import { LoaderIcon } from "lucide-react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { styled } from "@mui/material/styles";
import { AuthUser } from "@/app/_ProtectRoute/AuthUser";

const MyOrder = () => {
  const jwt = localStorage.getItem("jwt");
  const user = JSON.parse(localStorage.getItem("user"));
  const [orderList, setOrderList] = useState();
  const [loading, setLoading] = useState();

  // Steps for order status
  const steps = ["PENDING", "ORDER PLACED", "SHIPPED", "DELIVERED"];

  // Custom styling for Stepper
  const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
    "& .MuiStepLabel-label": {
      color: "#3b82f6", // Your desired label color
    },
    "& .Mui-completed": {
      color: "#10b981", // Color for completed steps
    },
    "& .Mui-active": {
      color: "#f59e0b", // Color for active step
    },
  }));

  const CustomStep = styled(Step)(({ theme }) => ({
    "& .MuiStepIcon-root": {
      color: "#e5e7eb", // Default icon color
      "&.Mui-completed": {
        color: "#10b981", // Color for completed icon
      },
      "&.Mui-active": {
        color: "#f59e0b", // Color for active icon
      },
    },
  }));

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    setLoading(true);
    try {
      const orderList = await getMyOrder(user.id, jwt);
      setOrderList(orderList);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="p-3 bg-primary text-xl font-bold text-center text-white">
        My Order
      </h2>
      <div className="py- mx-7 md:mx-20">
        <h2 className="text-3xl font-bold text-primary">Order History</h2>
        {loading ? (
          <div className="min-h-[80vh] flex justify-center items-center">
            <LoaderIcon className="animate-spin w-10 h-10 text-primary" />
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-5">
            {orderList?.map((order, i) => (
              <Collapsible key={i} className="w-full">
                <CollapsibleTrigger>
                  <div className="border bg-slate-100 flex justify-around p-5 w-[90vw] flex-wrap">
                    <h2>
                      <span className="font-bold mr-2">Order Date:</span>
                      {moment(order?.createdAt).format(`DD/MMM/yyyy`)}
                    </h2>
                    <h2>
                      <span className="font-bold mr-2">Total Amount:</span> 
                      {order?.totalOrderAmount}
                    </h2>
                    <h2>
                      <span className="font-bold mr-2">Status:</span> 
                      {order?.status}
                    </h2>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="flex p-2 flex-col gap-5 justify-center w-[90vw]">
                  <>
                    <Stepper activeStep={steps.indexOf(order.status)} alternativeLabel>
                      {steps.map((label) => (
                        <CustomStep key={label}>
                          <CustomStepLabel>{label}</CustomStepLabel>
                        </CustomStep>
                      ))}
                    </Stepper>
                    {order?.orderItemList.map((orderItem, index) => (
                      <MyOrderItem orderItem={orderItem} key={index} />
                    ))}
                  </>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProtectedMyOrder() {
  return (
    <AuthUser>
      <MyOrder />
    </AuthUser>
  );
}
