"use client";
import React, { useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getSliders } from "../_utils/GlobalApi";
import Image from "next/image";

function Slider({ sliderList }) {

  return (
    <div >
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}>
        <CarouselContent>
          {sliderList.map((slider, i) => (
            <CarouselItem key={i}>
              <Image
                src={`${process.env.NEXT_PUBLIC_BAKEND_BASE_URL}${slider?.attributes?.image?.data[0]?.attributes?.url}`}
                width={1000}
                height={400}
                unoptimized={true}
                alt="slider"
                className="w-full h-[200px] lg:h-[500px] md:h-[300px] object-cover rounded-2xl"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default Slider;
