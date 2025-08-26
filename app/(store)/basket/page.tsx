"use client";

import React from "react";
import useBasketStore from "@/store/store";
import { Button } from "@/components/ui/button";
import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { Metadata } from "@/actions/createCheckoutSession";

export default function BasketPage() {
  const {
    basket,
    removeProduct,
    incrementProduct,
    decrementProduct,
    getTotalPrice,
    clearBasket,
    getGroupedItems,
    getTotalItems,
  } = useBasketStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const groupedItems = getGroupedItems();

  const [loading, setLoading] = React.useState(false);

  if (totalItems === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-2xl font-bold">Your basket is empty</h2>
      </div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);

    if (!isSignedIn) {
      toast.custom(
        (t) => (
          <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-lg">
            <p className="text-gray-800">
              Please <b>sign in</b> to checkout your order
            </p>
            <SignInButton mode="modal">
              <Button
                onClick={() => toast.dismiss(t.id)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform transition-all hover:scale-105"
              >
                Sign in
              </Button>
            </SignInButton>
          </div>
        ),
        {
          duration: 6000,
        }
      );
    }

    console.log(user?.primaryEmailAddress?.emailAddress);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerEmail: user?.primaryEmailAddress?.emailAddress ?? "",
        customerName: user?.fullName ?? "Anonymous",
        clerkUserId: user?.id ?? "",
      };

      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      toast.error("Failed to create checkout session" + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Basket</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {basket.map((item) => (
            <div key={item.product._id} className="flex gap-4 border-b py-4">
              <div className="relative w-24 h-24">
                <Image
                  src={urlFor(item.product.image).url()}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">
                  ${item.product.price} * {item.quantity}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decrementProduct(item.product)}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => incrementProduct(item.product)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeProduct(item.product)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  ${item.product.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Items ({totalItems}):</span>
              <span>${totalPrice}</span>
            </div>
            <Button
              className="w-full mt-4"
              onClick={clearBasket}
              variant="destructive"
            >
              Clear Basket
            </Button>
            <Button className="w-full mt-2" onClick={handleCheckout}>
              {loading ? "Loading..." : "Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
