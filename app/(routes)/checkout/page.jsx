"use client";
import { UpdateCartContext } from "@/app/_context/UpdateCartContext";
import {
  createOrder,
  deleteCartItems,
  getCartItemsApi,
} from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { ArrowBigRight, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef, useContext } from "react";
import { toast } from "sonner";

const Checkout = () => {
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);
  const [cartItemsList, setCartItemsList] = useState([]);  
  const [subtotal, setSubtotal] = useState(0);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dollarRate, setDollarRate] = useState(null);
  const [payBtnDisabled, setPayBtnDisabled] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    zip: "",
    address: "",
  });

  const formDataRef = useRef(formData);
  const totalInrRef = useRef(0);
  const totalUsdRef = useRef(0);

  const router = useRouter();
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedJwt = localStorage.getItem("jwt");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedJwt && storedUser) {
      setJwt(storedJwt);
      setUser(storedUser);
    } else {
      router.push("/sign-in");
    }
  }, [router]);

  useEffect(() => {
    if (jwt && user) {
      fetchExchangeRate();
      getCartItems();
    }
  }, [jwt, user, router]);

  useEffect(() => {
    if (cartItemsList.length > 0 && dollarRate) {
      const total = cartItemsList.reduce((acc, item) => acc + item.amount, 0);
      const deliveryCharge = 15.0;
      const tax = ((9 / 100) * total).toFixed(2);
      const totalInINR = parseFloat(total) + parseFloat(tax) + deliveryCharge;
      setSubtotal(total.toFixed(2));
      const totalInUSD = totalInINR * dollarRate;
      totalUsdRef.current = totalInUSD.toFixed(2);
      totalInrRef.current = totalInINR.toFixed(2);
    }
  }, [cartItemsList, dollarRate]);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/INR"
      );
      const data = await response.json();
      setDollarRate(data.rates.USD);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  const getCartItems = async () => {
    try {
      setLoading(true);
      const items = await getCartItemsApi(user.id, jwt);
      setCartItemsList(items);
      setTotalCartItems(items.length);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onApprove = (data) => {
    setPayBtnDisabled(true);
    setLoading(true);
    const paymentId = data.paymentID;

    if (!paymentId) {
      console.error("Payment ID not found.");
      return;
    }

    const payload = {
      data: {
        paymentId: paymentId,
        totalOrderAmount: totalInrRef.current,
        username: formDataRef.current.username,
        email: formDataRef.current.email,
        phone: formDataRef.current.phone,
        address: formDataRef.current.address,
        zip: formDataRef.current.zip,
        orderItemList: cartItemsList,
        userId: user.id,
      },
    };

    createOrder(payload, jwt)
      .then((res) => {
        toast("Order Placed Successfully!!!");

        cartItemsList.forEach((item) => {
          deleteCartItems(item.id, jwt).then(() => {
            setUpdateCart(!updateCart);
            router.replace("/order-confirmation");
          });
        });
      })
      .catch((err) => {
        setPayBtnDisabled(false);
        setLoading(false);
      });
  };

  return (
    <div>
      <h2 className="p-3 bg-primary text-xl font-bold text-center text-white">
        Checkout
      </h2>
      {loading ? (
        <div className="min-h-[80vh] flex justify-center items-center">
          <LoaderIcon className="animate-spin w-10 h-10 text-primary" />
        </div>
      ) : (
        <div className="p-5 px-5 md:px-10 grid grid-cols-1 lg:grid-cols-3 py-8">
          <div className="md:col-span-2 mx-20">
            <h2 className="font-bold text-3xl">Billing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-10 mt-3">
              <Input
                name="username"
                placeholder="Name"
                value={formData.username}
                onChange={handleInputChange}
              />
              <Input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-10 mt-3">
              <Input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <Input
                name="zip"
                placeholder="Zip"
                value={formData.zip}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-3">
              <Input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mx-10 lg:mt-0 mt-10 border">
            <h2 className="p-3 bg-gray-200 font-bold text-center">
              Total Cart ({totalCartItems})
            </h2>
            <div className="p-4 flex flex-col gap-4">
              <h2 className="font-bold flex justify-between">
                Subtotal: <span>₹{subtotal}</span>
              </h2>
              <hr />
              <h2 className="flex justify-between">
                Delivery: <span>₹15.00</span>
              </h2>
              <h2 className="flex justify-between">
                Tax (9%): <span>₹{((9 / 100) * subtotal).toFixed(2)}</span>
              </h2>
              <hr />
              <h2 className="font-bold flex justify-between">
                Total: <span>₹{totalInrRef.current}</span>
              </h2>
              <h2 className="font-bold flex justify-between">
                Total in Dollar: <span>${totalUsdRef.current}</span>
              </h2>

              {totalInrRef.current > 15 && (
                <PayPalButtons
                  disabled={
                    !(
                      formData.username &&
                      formData.email &&
                      formData.phone &&
                      formData.address &&
                      formData.zip
                    ) || payBtnDisabled
                  }
                  style={{ layout: "horizontal" }}
                  onApprove={onApprove}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: totalUsdRef.current,
                            currency_code: "USD", // Ensure this is set to USD
                          },
                        },
                      ],
                    });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
