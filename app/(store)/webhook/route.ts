import { Metadata } from "@/actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { client } from "@/sanity/lib/backendClient"
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        return new Response('No signature found', { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return new Response('No webhook secret found', { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
        return new Response('Invalid signature', { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        try {
            const order = await createOrderInSanity(session);
            console.log('Order created in Sanity:', order);
        } catch (error) {
            console.error('Error creating order in Sanity:', error);
            return new Response('Error creating order in Sanity', { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
    const {
        id,
        amount_total,
        currency,
        metadata,
        payment_intent,
        customer_details,
        total_details
    } = session;

    // Log the session metadata to debug
    console.log('Session metadata:', metadata);

    const { orderNumber, customerEmail, customerName, clerkUserId } = metadata as Metadata;

    const lineItemsWithProducts = await stripe.checkout.sessions.listLineItems(
        id,
        { expand: ['data.price.product'] }
    );

    // Log the line items to debug
    console.log('Line items:', JSON.stringify(lineItemsWithProducts.data.map(item => ({
        id: item.id,
        product_id: (item.price?.product as Stripe.Product)?.metadata?.product_id,
        description: (item.price?.product as Stripe.Product)?.description,
        name: (item.price?.product as Stripe.Product)?.name,
        quantity: item.quantity
    }))));

    const sanityProducts = lineItemsWithProducts.data.map((item) => {
        const product = item.price?.product as Stripe.Product;

        // Try to extract product ID from different possible locations
        let productId = product?.metadata?.product_id;

        // If no product_id in metadata, try to extract it from the description
        // Format: "Product ID abc123"
        if (!productId && product?.description) {
            const match = product.description.match(/Product ID ([\w\d]+)/);
            if (match && match[1]) {
                productId = match[1];
                console.log('Extracted product ID from description:', productId);
            }
        }

        // Log each product reference being created
        console.log('Creating product reference:', {
            productId,
            name: product?.name,
            description: product?.description,
            metadata: product?.metadata
        });

        if (!productId) {
            console.error('Missing product_id for product:', product?.name || 'Unknown product');
        }

        // Only create a product reference if we have a valid product ID
        if (productId) {
            return {
                _key: crypto.randomUUID(),
                product: {
                    _type: "reference",
                    _ref: productId,
                },
                quantity: item.quantity || 0,
            };
        } else {
            // If no product ID, create a fallback object with just the name and quantity
            return {
                _key: crypto.randomUUID(),
                quantity: item.quantity || 0,
            };
        }
    });

    const totalQuantity = lineItemsWithProducts.data.reduce(
        (total, item) => item.quantity ? total + item.quantity : total,
        0
    );

    const order = await client.create({
        _id: id,
        _type: "order",
        orderNumber,
        stripeCheckoutSessionId: id,
        stripePaymentIntentId: payment_intent,
        customerName,
        stripeCustomerId: session.customer || customer_details?.email || customerEmail, // Use actual Stripe customer ID if available
        clerkUserId,
        email: customerEmail,
        currency,
        amountDiscounted: total_details?.amount_discount ? total_details.amount_discount / 100 : 0,
        products: sanityProducts,
        totalPrice: amount_total ? amount_total / 100 : 0,
        status: "pending",
        totalQuantity,
    });

    return order;
}
