"use server";

import { BasketItem } from "@/store/store";
import stripe from "@/lib/stripe";
import { urlFor } from "@/sanity/lib/image";

export type Metadata = {
    id: string;
    orderNumber: string;
    customerEmail: string;
    customerName: string;
    clerkUserId: string;
};

export type GroupedBasketItem = {
    product: BasketItem["product"];
    quantity: number;
}

export async function createCheckoutSession(items: GroupedBasketItem[], metadata: Metadata) {
    try {
        const itemsWithPrice = items.filter((item) => !item.product.price);
        if (itemsWithPrice.length > 0) {
            throw new Error("Some items in the basket do not have a price");
        }

        const customers = await stripe.customers.list({
            email: metadata.customerEmail,
            limit: 1
        })

        let customerId: string | undefined;
        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
        }


        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            allow_promotion_codes: true,
            line_items: items.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.product.name,
                        description: "Product ID " + item.product._id,
                        images: item.product.image
                            ? [urlFor(item.product.image).url()]
                            : [],
                        metadata: {
                            product_id: item.product._id,
                        },
                    },
                    unit_amount: item.product.price * 100,
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: process.env.VERCEL_URL ?
                `https://${process.env.VERCEL_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}` :
                process.env.NEXT_PUBLIC_BASE_URL +
                `/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
            cancel_url: process.env.VERCEL_URL ?
                `https://${process.env.VERCEL_URL}/basket` :
                process.env.NEXT_PUBLIC_BASE_URL + "/basket",
            metadata,
        });

        return session.url
    } catch (error) {
        throw new Error("Some items in the basket do not have a price", { cause: error });
    }
}