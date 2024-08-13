"use client";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import { UpdateCartContext } from "./_context/UpdateCartContext";
import { useEffect, useState } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { getCartItemsApi } from "./_utils/GlobalApi";

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const params = usePathname();
  const [updateCart, setUpdateCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartItemsList, setCartItemsList] = useState([]);
  console.log(cartItemsList);
  
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);

  useEffect(() => {
    const jwt = window.localStorage.getItem("jwt");
    const user = JSON.parse(window.localStorage.getItem("user"));
    setUser(user);
    setJwt(jwt);
  }, []);

  useEffect(() => {
    if (user && jwt) {
      getCartItems();
    }
  }, [user, jwt, updateCart]);

  const getCartItems = async () => {
    try {
      setLoading(true);
      const cartItemsList = await getCartItemsApi(user.id, jwt);
      setUpdateCart(true)
      setCartItemsList(cartItemsList);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const showHeader =
    params === "/sign-in" || params === "/create-account" ? false : true;

  return (
    <PayPalScriptProvider
      options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
      <html lang="en">
        <UpdateCartContext.Provider
          value={{
            updateCart,
            setUpdateCart,
            loading,
            setLoading,
            cartItemsList,
            setCartItemsList,
          }}>
          <body className={outfit.className}>
            {showHeader && <Header />}
            {children}
            <Toaster />
          </body>
        </UpdateCartContext.Provider>
      </html>
    </PayPalScriptProvider>
  );
}
