"use client";
import { Button } from "@/components/ui/button";
import { LoaderIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SheetClose } from "@/components/ui/sheet";
const CartItemList = ({ cartItemsList = [], onDeleteItem }) => {
  const [loadingItemId, setLoadingItemId] = useState(null);
  
  const handleDelete = (id) => {
    setLoadingItemId(id); // Set the id of the item being deleted
    onDeleteItem(id).finally(() => {
      setLoadingItemId(null); // Reset the loading state after the deletion is complete
    });
  };
console.log(cartItemsList);


  return (
    <div>
      {cartItemsList.length === 0 ? (
        <div className="min-h-[80vh] flex flex-col gap-5 justify-center items-center">
          <h2>No Item Added in the Cart</h2>
          <SheetClose>
            <Button>Back To Purchase</Button>
          </SheetClose>
        </div>
      ) : (
        <div className="flex flex-col gap-5 overflow-auto max-h-[80vh]">
          {cartItemsList.map((cart, i) => (
            <div
              key={i}
              className="flex justify-between items-center ">
              <div className="flex gap-6 ">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BAKEND_BASE_URL}${cart?.image}`}
                  width={70}
                  height={70}
                  alt={cart.name}
                  unoptimized={true}
                  className="border p-2 object-contain"
                />
                <div>
                  <h2 className="font-bold">{cart.name}</h2>
                  <h2>Quantity {cart.quantity}</h2>
                  <h2 className="text-lg font-bold">₹ {cart.amount}</h2>
                </div>
              </div>
              {loadingItemId === cart.id ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <TrashIcon
                  className="cursor-pointer"
                  onClick={() => {
                    handleDelete(cart.id);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartItemList;
