"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductItemDetail from "./ProductItemDetail";
import { getCartItemsApi } from "../_utils/GlobalApi";

const ProductItem = ({ product }) => {
  const [open, setOpen] = useState(false);
  const imageUrl = `${process.env.NEXT_PUBLIC_BAKEND_BASE_URL}${product?.attributes?.images?.data[0]?.attributes?.url}`;

  return (
    <div className="flex flex-col items-center justify-center p-2  md:p-6 border hover:border-primary hover:scale-105 transition-all ease-in-out cursor-pointer rounded-lg ">
      <Image
        src={imageUrl}
        unoptimized={true}
        alt={product?.attributes?.name || "Product Image"}
        width={300}
        height={150}
        className="h-[150px] w-[200] object-contain"
      />

      <h2 className="font-bold text-lg">{product?.attributes?.name}</h2>
      <div className="flex gap-3">
        {product?.attributes?.sellingPrice && (
          <h2 className="font-bold text-lg ">
            ₹{product?.attributes?.sellingPrice}
          </h2>
        )}
        <h2
          className={`font-bold ${
            product?.attributes?.sellingPrice && `text-red-600 line-through`
          }`}>
          {product?.attributes?.mrp}
        </h2>
      </div>

      <Dialog
        open={open}
        onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="text-primary hover:text-white hover:bg-primary"
            variant="outline">
            Add to Cart
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <ProductItemDetail
                product={product}
                setOpen={setOpen}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductItem;
