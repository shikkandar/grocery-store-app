"use client";
import { Button } from "@/components/ui/button";
import { LoaderIcon, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import {
  addToCart,
  getCartItemsApi,
  updateCartItems,
} from "../_utils/GlobalApi";
import { toast } from "sonner";
import { UpdateCartContext } from "../_context/UpdateCartContext";

const ProductItemDetail = ({ product, setOpen }) => {
  const imageUrl = `${process.env.NEXT_PUBLIC_BAKEND_BASE_URL}${product?.attributes?.images?.data[0]?.attributes?.url}`;
  const { updateCart, setUpdateCart, cartItemsList } =useContext(UpdateCartContext);

  const [productTotalPrice, setProductTotalPrice] = useState(
    product?.attributes?.sellingPrice
      ? product?.attributes?.sellingPrice
      : product?.attributes?.mrp
  );
  const [quantity, setQuantity] = useState(1);
  const [loader, setLoader] = useState(false);

  const jwt = localStorage.getItem("jwt");
  const user = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();

  const AddToCart = async () => {
    setLoader(true);
    if (!jwt) {
      router.push("/sign-in");
      return;
    }

    // Check if the product is already in the cart
    const existingCartItem = cartItemsList.find(
      (item) => item.product === product.id
    );
    console.log(existingCartItem);

    if (existingCartItem) {
      toast(
        "This product is already in your cart. One more quantity has been added.!!!"
      );
      setLoader(false);

      const id = existingCartItem.id;
      const data = {
        data: {
          quantity: existingCartItem.quantity + 1,
        },
      };

      try {
        setLoader(true);
        await updateCartItems(id, data, jwt);
        setOpen(false);
      } catch (error) {
        console.log(error);
      }
      return;
    }

    const data = {
      data: {
        quantity: quantity,
        amount: (quantity * productTotalPrice).toFixed(2),
        products: product.id,
        users_permissions_users: user.id,
        userId: user.id,
      },
    };

    addToCart(data, jwt).then(
      (res) => {
        console.log(res);
        toast("Added to cart");
        setUpdateCart(!updateCart);
        setLoader(false);

        setOpen(false);
      },
      (err) => {
        toast.error("Error adding to cart");
        setLoader(false);
      }
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-7 bg-white text-black ">
      <Image
        src={imageUrl}
        width={300}
        height={300}
        unoptimized={true}
        className="bg-slate-200 p-5 h-[320px] w-[300px] object-contain rounded-lg"
      />
      <div className="flex flex-col justify-between">
        <h2 className="text-2xl font-bold ">{`${product?.attributes?.name} ${product?.attributes?.itemQuantityType}`}</h2>
        <h2 className="text-sm font-bold text-gray-500">
          {product?.attributes?.description}
        </h2>
        <div className="flex gap-3 items-center">
          {product?.attributes?.sellingPrice && (
            <h2 className="font-bold text-3xl ">
              ₹{product?.attributes?.sellingPrice}
            </h2>
          )}
          <h2
            className={`font-bold text-3xl ${
              product?.attributes?.sellingPrice
                ? "text-red-600 line-through"
                : ""
            }`}>
            ₹{product?.attributes?.mrp}
          </h2>
        </div>
        <h2 className="font-medium text-lg">
          Quantity ({product?.attributes?.itemQuantityType})
        </h2>
        <div className="flex flex-col items-baseline ">
          <div className="flex gap-3 items-center">
            <div className="p-2 border flex gap-10 items-center">
              <button
                onClick={() =>
                  quantity > 1 ? setQuantity(quantity - 1) : setQuantity(1)
                }>
                -
              </button>
              <h2>{quantity}</h2>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <h2 className="text-2xl font-bold">
              = ₹{(quantity * productTotalPrice).toFixed(2)}
            </h2>
          </div>
          <Button
            className="mt-3 flex gap-3"
            onClick={() => AddToCart()}
            disabled={loader}>
            {loader ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <ShoppingBasket />
            )}
            Add To Cart
          </Button>
        </div>
        <h2>
          <span className="font-bold">Category:</span>{" "}
          {product?.attributes?.categories?.data[0]?.attributes?.name}
        </h2>
      </div>
    </div>
  );
};

export default ProductItemDetail;
