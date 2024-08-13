import { useContext } from "react";

const { default: axios } = require("axios");

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:1337/api",
});

export const getCategory = () => axiosClient.get("/categories?populate=*");

export const getSliders = () =>
  axiosClient.get("/sliders?populate=*").then((res) => {
    return res.data.data;
  });

export const getCategoryList = () =>
  axiosClient.get("/categories?populate=*").then((res) => {
    return res.data.data;
  });

export const getAllProducts = () =>
  axiosClient.get("/products?populate=*").then((res) => {
    return res.data.data;
  });

export const getProductByCategory = async (category) => {
  try {
    const response = await axiosClient.get(
      `products?filters[categories][name][$in]=${category}&populate=*`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
  }
};

export const registerUser = (username, email, password) =>
  axiosClient.post("/auth/local/register", {
    username,
    email,
    password,
  });

export const signIn = (email, password) =>
  axiosClient.post("/auth/local", {
    identifier: email,
    password: password,
  });

export const addToCart = (data, jwt) =>
  axiosClient.post(`/user-carts`, data, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

export const getCartItemsApi = (userId, jwt) =>
  axiosClient
    .get(
      `/user-carts?filters[userId][$eq]=${userId}&[populate][products][populate][images][populate][0]=url`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    .then((res) => {
      const data = res.data.data;
      const cartItemsList = data.map((item, i) => ({
        name: item?.attributes?.products?.data[0]?.attributes?.name,
        quantity: item?.attributes?.quantity,
        amount: item?.attributes?.amount,
        image:
          item?.attributes?.products?.data[0]?.attributes?.images?.data[0]
            ?.attributes?.url,
        actualPrice: item?.attributes?.products?.data[0]?.attributes?.mrp,
        id: item?.id,
        product: item?.attributes?.products.data[0]?.id,
      }));
      return cartItemsList;
    });

export const deleteCartItems = (id, jwt) =>
  axiosClient.delete(`/user-carts/${id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });


  export const updateCartItems = (id, data, jwt) =>
    axiosClient.put(`/user-carts/${id}`, data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });


export const createOrder = (data, jwt) =>
  axiosClient.post(`/orders`, data, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

export const getMyOrder = (userId, jwt) =>
  axiosClient
    .get(
      `http://localhost:1337/api/orders?filters[userId][$eq]=7&populate[orderItemList][populate]=product.images`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    .then((res) => {
      const response = res.data.data;

      const orderItemList = response.map((item) => ({
        id: item.id,
        totalOrderAmount: item?.attributes?.totalOrderAmount,
        paymentId: item?.attributes?.paymentId,
        createdAt: item?.attributes?.createdAt,
        orderItemList: item?.attributes?.orderItemList,
        status: item?.attributes?.Status,
      }));
      return orderItemList;
    });
