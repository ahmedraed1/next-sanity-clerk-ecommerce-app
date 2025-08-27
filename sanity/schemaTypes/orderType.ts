import { ShoppingCart } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const orderType = defineType({
    name: "order",
    title: "Order",
    type: "document",
    icon: ShoppingCart,
    fields: [
        defineField({
            name: "orderNumber",
            title: "Order Number",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "stripeCheckoutSessionId",
            title: "Stripe Checkout Session ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "stripeCustomerId",
            title: "Stripe Customer ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "clerkUserId",
            title: "Clerk User ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "customerName",
            title: "Customer Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: "stripePaymentIntentId",
            title: "Stripe Payment Intent ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "products",
            title: "Products",
            type: "array",
            of: [defineArrayMember({
                type: "object",
                fields: [
                    defineField({
                        name: "product",
                        title: "Product Bought",
                        type: "reference",
                        to: { type: "product" },
                    }),
                    defineField({
                        name: "quantity",
                        title: "Quantity Purchased",
                        type: "number",
                    }),
                ],
                preview: {
                    select: {
                        product: "product.name",
                        image: "product.image",
                        quantity: "quantity",
                        price: "product.price",
                        currency: "product.currency",
                    },
                    prepare(selection) {
                        const { product, image, quantity, price, currency } = selection;
                        return {
                            title: `${product} x ${quantity}`,
                            subtitle: `Quantity: ${quantity} | Price: ${price * quantity}`,
                            media: image,
                        };
                    },
                }

            })],

            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "totalPrice",
            title: "Total Price",
            type: "number",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "totalQuantity",
            title: "Total Quantity",
            type: "number",
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: "currency",
            title: "Currency",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "amountDiscounted",
            title: "Amount Discounted",
            type: "number",
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: "status",
            title: "Order Status",
            type: "string",
            options: {
                list: [
                    { title: "Pending", value: "pending" },
                    { title: "Processing", value: "processing" },
                    { title: "Shipped", value: "shipped" },
                    { title: "Delivered", value: "delivered" },
                    { title: "Cancelled", value: "cancelled" },
                ],
                layout: "radio",
                direction: "horizontal",
            },
            validation: (Rule) => Rule.required(),
        }),


    ],
    preview: {
        select: {
            orderNumber: "orderNumber",
            customerName: "customerName",
            email: "email",
            totalPrice: "totalPrice",
            currency: "currency",
            status: "status",
        },
        prepare(selection) {
            const { orderNumber, customerName, email, totalPrice, currency, status } = selection;
            return {
                title: `Order #${orderNumber}`,
                subtitle: `${customerName} | ${email} | ${totalPrice} ${currency} | ${status}`,
                media: ShoppingCart
            };
        },
    },
})