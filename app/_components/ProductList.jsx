"use client";
import React from "react";
import ProductItem from "./ProductItem";
import _ from "lodash";

const ProductList = ({ productList }) => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const shuffledProducts = _.shuffle(productList);
  const displayProducts = currentPath === "/" ? shuffledProducts.slice(0, 8) : shuffledProducts;

  return (
    <div className="mt-5">
      <h2 className="text-green-600 text-2xl font-bold">
        Our Popular Products
      </h2>
      <div className="mt-5 flex flex-wrap gap-5 justify-evenly">
        {displayProducts.map((product, i) => (
          <ProductItem key={i} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
