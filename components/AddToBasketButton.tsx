"use client";

import React, { useState } from "react";
import useBasketStore from "@/store/store";
import { toast } from "react-hot-toast";

type productType = {
  _id: string;
  name: string;
  price: number;
  image: { url: string }[];
  slug: { current: string };
  stock: number;
};

export default function AddToBasketButton({
  product,
}: {
  product: productType;
}) {
  const { addProduct } = useBasketStore();
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return;
  const addToBasket = async () => {
    await addProduct(product);
    toast.success("Product Added to Basket");
  };

  return (
    <div>
      <button
        disabled={product.stock === 0}
        className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
        onClick={() => addToBasket()}
      >
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
