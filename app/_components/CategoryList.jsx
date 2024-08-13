import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategoryList = ({ categoryList }) => {
  return (
    <div className="mt-5">
      <h2 className="text-green-600 text-2xl font-bold">Shop by categories</h2>
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  lg:grid-cols-5 xl:grid-cols-7 gap-5 ">
        {categoryList.map((category, i) => (
          <Link key={i} href={`/products_category/${category?.attributes?.name}`} className="flex flex-col items-center bg-green-50 p-4 rounded-lg group cursor-pointer hover:bg-green-600">
            <Image
              src={`${process.env.NEXT_PUBLIC_BAKEND_BASE_URL}${category?.attributes?.icon?.data[0]?.attributes?.url}`}
              width={50}
              height={50}
              alt="icon"
              unoptimized={true}
              className="group-hover:scale-125 transition-all ease-in-out"
            />
            <h2 className="text-green-800">{category?.attributes?.name}</h2>
          </Link >
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
