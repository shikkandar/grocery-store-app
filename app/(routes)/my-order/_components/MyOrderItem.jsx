"use client";
import Image from "next/image";
import React from "react";

const MyOrderItem = ({ orderItem }) => {
  const imageUrl = `${process.env.NEXT_PUBLIC_BAKEND_BASE_URL}${orderItem?.product?.data?.attributes?.images?.data[0]?.attributes?.url}`;

  console.log(orderItem?.product?.data?.attributes?.sellingPrice);

  return (
    <>
      <div className="flex justify-around items-center flex-wrap">
        <Image
          src={imageUrl}
          width={80}
          height={80}
          alt="image"
          className="bg-gray-100 p-5 border rounded-md w-[80px] h-[80px] object-contain"
        />

        <h2 className="min-w-[150px]">{orderItem.product.data.attributes.name}</h2>

        <h2 className="min-w-[150px]">
          Price:
          <span className="font-bold text-primary pr-2">
          ₹{orderItem?.product?.data?.attributes?.sellingPrice}
          </span>
          <span className="text-red-600 line-through font-bold text-lg">
            {orderItem.product.data.attributes.mrp}
          </span>
         
        </h2>
        <h2 className="min-w-[150px]">Quantity:{orderItem.quantity}</h2>
        <h2 className="min-w-[150px]">
          Total:
          <span className="font-bold ">{orderItem.amount}</span>
        </h2>
      </div>
      <hr />
    </>
  );
};

export default MyOrderItem;
