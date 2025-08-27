"use client";

import React from "react";
import { useAuth } from "@clerk/nextjs";
import { getOrders } from "@/sanity/lib/orders/getOrders";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type Product = {
  _id: string;
  name: string;
  price: number;
  description: any[];
  image: {
    _type: string;
    asset: any;
  };
  categories: any[];
  slug: {
    _type: string;
    current: string;
  };
  stock: number;
  _createdAt: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
};

type OrderProduct = {
  _key: string;
  product: Product;
  quantity: number;
};

type Order = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _type: string;
  _rev: string;
  clerkUserId: string;
  customerName: string;
  email: string;
  orderNumber: string;
  status: string;
  stripeCheckoutSessionId: string;
  stripeCustomerId: string;
  stripePaymentIntentId: string;
  totalPrice: number;
  totalQuantity: number;
  amountDiscounted: number;
  currency: string;
  products: OrderProduct[];
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default function Page() {
  const { userId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (userId) {
      getOrders(userId).then((res) => setOrders(res));
    }
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order._id} className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Order #{order.orderNumber}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {format(new Date(order._createdAt), "PPP")}
                  </p>
                </div>
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.products.map((item) => (
                    <div
                      key={item._key}
                      className="flex items-center space-x-4 py-2"
                    >
                      <div className="relative h-20 w-20 rounded-md overflow-hidden">
                        <Image
                          src={urlFor(item.product.image).url()}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between pt-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Items:</p>
                      <p className="font-medium">{order.totalQuantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount:</p>
                      <p className="font-medium text-lg">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
