"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Slider from "./_components/Slider";
import {
  getAllProducts,
  getCategoryList,
  getSliders,
} from "./_utils/GlobalApi";
import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Footer from "./_components/Footer";
import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";

export default function Home() {
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.localStorage.setItem("redirectPath", window.location.pathname);
    const fetchDara = async () => {
      try {
        const [sliders, categories, products] = await Promise.all([
          getSliders(),
          getCategoryList(),
          getAllProducts(),
        ]);
        setSliderList(sliders);
        setCategoryList(categories);
        setProductList(products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDara();
  }, []);
  if (loading) {
    return (
      <div className=" min-h-[80vh] flex justify-center items-center">
        <LoaderIcon className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }
  return (
    <>
      <div
        style={{ minHeight: "100vh" }}
        className="p-5 md:p-15 px-16">
        {/* Sliders */}
        <Slider sliderList={sliderList} />
        {/* Categories List */}
        <CategoryList categoryList={categoryList} />
        {/* Products List */}
        <ProductList productList={productList} />
        {/* Banner */}
        <div className="relative w-full aspect-[16/6] md:aspect-[21/6] mt-5 md:mt-10">
          <Image
            src="/delivery.jpg"
            alt="Delivery"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
}
