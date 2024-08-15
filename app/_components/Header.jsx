"use client";

import { Button } from "@/components/ui/button";
import { CircleUserIcon, LayoutGrid, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  deleteCartItems,
  getCartItemsApi,
  getCategory,
} from "../_utils/GlobalApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UpdateCartContext } from "../_context/UpdateCartContext";
import CartItemList from "./CartItemList";
import { toast } from "sonner";

function Header() {
  const [categoryList, setCategoryList] = useState([]);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const { updateCart } = useContext(UpdateCartContext);
  const [cartItemsList, setCartItemsList] = useState([]);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(window.localStorage.getItem("user"));
      const storedJwt = window.localStorage.getItem("jwt");
      setUser(storedUser);
      setJwt(storedJwt);
      setIsLogin(!!storedJwt);
    }
  }, []);

  useEffect(() => {
    getCategoryList();
  }, []);

  useEffect(() => {
    if (user && jwt) {
      getCartItems();
    }
  }, [updateCart, user, jwt]);

  useEffect(() => {
    let total = 0;
    if (cartItemsList?.length > 0) {
      cartItemsList.forEach((item) => (total += item.amount));
    }
    setSubtotal(total.toFixed(2));
  }, [cartItemsList]);

  const getCategoryList = async () => {
    try {
      const res = await getCategory();
      setCategoryList(res.data.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const getCartItems = async () => {
    try {
      setLoading(true);
      const cartItemsList = await getCartItemsApi(user.id, jwt);
      setCartItemsList(cartItemsList);
      setTotalCartItems(cartItemsList.length);
    } catch (error) {
      console.error("Failed to fetch cart items", error);
    } finally {
      setLoading(false);
    }
  };

  const onSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    router.push("/sign-in");
  };

  const onDeleteItem = (id) => {
    deleteCartItems(id, jwt)
      .then((res) => {
        toast.success("Item deleted successfully");
        getCartItems();
      })
      .catch((error) => {
        toast.error("Failed to delete item");
        console.error("Failed to delete item", error);
      });
  };

  return (
    <div className="p-5 px-8 shadow-md flex justify-between sticky top-0 z-50 bg-white">
      <div className="flex items-center gap-5">
        <Link href={"/"}>
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={50} height={50} />
            <div>
              <h2 className="text-xl font-bold text-red-400">Grocery</h2>
              <h2 className="text-xl font-bold text-primary">Store</h2>
            </div>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <h2 className="hidden md:flex gap-2 items-center border rounded-full p-2 px-10 bg-slate-200 cursor-pointer">
              <LayoutGrid className="h-5 w-5" /> Category
            </h2>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Browse Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categoryList.map((category, i) => (
              <Link key={i} href={`/products_category/${category?.attributes?.name}`}>
                <DropdownMenuItem className="capitalize flex gap-4 items-center cursor-pointer">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BAKEND_BASE_URL}${category?.attributes?.icon?.data[0]?.attributes?.url}`}
                    unoptimized={true}
                    alt="icon"
                    width={30}
                    height={30}
                  />
                  <h2 className="text-lg">{category?.attributes?.name}</h2>
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="md:flex gap-3 items-center border rounded-full p-2 px-5 hidden">
          <Search />
          <input type="text" placeholder="search" className="outline-none" />
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <h2 className="flex gap-2 items-center text-lg cursor-pointer">
              <ShoppingBag />
              <span className="bg-primary px-2 rounded-full text-white ">
                {totalCartItems}
              </span>
            </h2>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="bg-primary text-white font-bold text-lg p-2">
                My Cart
              </SheetTitle>
              <SheetDescription>
                <CartItemList
                  cartItemsList={cartItemsList}
                  onDeleteItem={onDeleteItem}
                  loading={loading}
                />
              </SheetDescription>
            </SheetHeader>
            {cartItemsList?.length > 0 && (
              <SheetClose asChild>
                <div className="absolute w-[90%] bottom-6 flex flex-col">
                  <h2 className="text-lg font-bold flex justify-between">
                    Subtotal <span>₹ {subtotal}</span>
                  </h2>
                  <Button onClick={() => router.push(jwt ? "/checkout" : "/sign-in")}>
                    Checkout
                  </Button>
                </div>
              </SheetClose>
            )}
          </SheetContent>
        </Sheet>
        {!isLogin ? (
          <Link href={"/sign-in"}>
            <Button>Log in</Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CircleUserIcon className="cursor-pointer h-8 w-8 bg-green-100 text-primary p-1 rounded-full" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.replace("/my-order")}>
                My order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSignOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export default Header;
