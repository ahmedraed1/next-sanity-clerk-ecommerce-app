"use client";

import React from "react";
import useBasketStore from "@/store/store";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { clearBasket } = useBasketStore();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  useEffect(() => {
    if (orderNumber) {
      clearBasket();
    }
  }, [orderNumber, clearBasket]);

  return (
    <div className="h-[calc(100vh-6rem)] flex items-center justify-center flex-col">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Order Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your order number is:{" "}
          <span className="font-semibold text-gray-800">{orderNumber}</span>
        </p>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            We'll send you a confirmation email with your order details shortly.
          </p>

          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
