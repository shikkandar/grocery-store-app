"use client";
import { useEffect, useState } from "react";
import { getCategoryList, getProductByCategory } from "@/app/_utils/GlobalApi";
import TopCategoryList from "../_component/TopCategoryList";
import ProductList from "@/app/_components/ProductList";
import Footer from "@/app/_components/Footer";
import { LoaderIcon } from "lucide-react";

const ProductCategory = ({ params }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryName = decodeURIComponent(params.categoryName || '');
  localStorage.setItem("redirectPath", window.location.pathname);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categories, products] = await Promise.all([
          getCategoryList(),
          getProductByCategory(params.categoryName),
        ]);
        setCategoryList(categories);
 
        
        setProductList(products);
        console.log(products);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.categoryName]);


  return (
    <div>
      <h2 className="p-4 bg-primary text-white font-bold text-center text-3xl capitalize">
        {categoryName}
      </h2>
      {loading ? (
        <div className=" min-h-[80vh] flex justify-center items-center">
          <LoaderIcon className="animate-spin w-10 h-10 text-primary" />
        </div>
      ) : (
        <>
          <TopCategoryList
            categoryList={categoryList}
            selectedCategory={params.categoryName}
          />
          <div className="p-5 md:p-15 px-16">
            <ProductList productList={productList} />
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default ProductCategory;
