"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const TopCategoryList = ({ categoryList, selectedCategory }) => {
  return (
    <div className="mt-5 flex gap-5 overflow-auto justify-center">
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        opts={{
          align: "start",
        }}
        className="w-full md:max-w-[50%] max-w-[80%]"
      >
        <CarouselContent>
          {categoryList.map((category, index) => (
            <CarouselItem
              key={index}
              className="flex flex-wrap basis-1/7 justify-center"
            >
              <div className="p-1">
                <Link
                  href={`/products_category/${category?.attributes?.name}`}
                  className={`flex flex-col items-center  p-4 rounded-lg group cursor-pointer hover:bg-green-600  hover:text-white w-[150px] min-w-[150px] ${
                    selectedCategory === category?.attributes?.name
                      ? "bg-green-600 text-white"
                      : "bg-green-50 text-green-800"
                  }`}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BAKEND_BASE_URL}${category?.attributes?.icon?.data[0]?.attributes?.url}`}
                    width={50}
                    height={50}
                    alt="icon"
                    unoptimized={true}
                    className="group-hover:scale-125 transition-all ease-in-out"
                  />
                  <h2>
                    {category?.attributes?.name}
                  </h2>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default TopCategoryList;
