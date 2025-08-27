import { client } from "../client"

export async function getOrders(userId: string) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const MY_ORDERS_QUERY = `*[_type == "order" && clerkUserId == $userId] | order(_createdAt desc) {
           ...,
           products[]{
             ...,
             product->
           }
        }`;
        const res = await client.fetch(MY_ORDERS_QUERY, { userId });
        return res || [];
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}